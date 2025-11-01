'use client';

import * as db from '@/lib/db';
import { ProductCategory } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Map category enum to display names
const categoryDisplayNames: Record<ProductCategory, string> = {
  [ProductCategory.Drinken]: 'Drinken',
  [ProductCategory.Brood_en_Beleg]: 'Brood en Beleg',
  [ProductCategory.Tussendoor]: 'Tussendoor',
  [ProductCategory.Aanvullend_beperkt]: 'Aanvullend Beperkt',
  [ProductCategory.Groenten_en_Fruit]: 'Groenten en Fruit',
  [ProductCategory.Overigen_producten]: 'Overige Producten',
  [ProductCategory.Extras]: 'Extra\'s',
};

// Define category order
const categoryOrder: ProductCategory[] = [
  ProductCategory.Drinken,
  ProductCategory.Brood_en_Beleg,
  ProductCategory.Tussendoor,
  ProductCategory.Aanvullend_beperkt,
  ProductCategory.Groenten_en_Fruit,
  ProductCategory.Overigen_producten,
  ProductCategory.Extras,
];

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const days = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  const dayName = days[dateObj.getDay()];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const monthName = months[dateObj.getMonth()];
  const year = String(dateObj.getFullYear()).slice(-2);
  return `${dayName} ${day} ${monthName} '${year}`;
}

export default function OrderOverview({ params }: PageProps) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<db.Order | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<Record<ProductCategory, Array<{ product: db.Product; quantity: number }>>>({} as any);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setOrderId(id);

      // Fetch order
      const orderData = await db.getOrderById(id);
      if (!orderData) {
        console.error('Order not found:', id);
        setError('Bestelling niet gevonden');
        setIsLoading(false);
        return;
      }
      setOrder(orderData);

      // Fetch all order lists for this order
      const orderLists = await db.getOrderListsByOrderId(id);
      
      // Fetch all products (we'll need them for display)
      const allProducts = await db.getAllProducts();
      const productMap = new Map(allProducts.map(p => [p.id, p]));

      // Aggregate quantities by product across all order lists
      const productTotals = new Map<string, { product: db.Product; quantity: number }>();
      
      for (const orderList of orderLists) {
        const orderRows = await db.getOrderRowsByOrderListId(orderList.id);
        orderRows.forEach(orderRow => {
          const existing = productTotals.get(orderRow.productId);
          const product = productMap.get(orderRow.productId);
          if (!product) return;
          
          if (existing) {
            existing.quantity += orderRow.quantity;
          } else {
            productTotals.set(orderRow.productId, {
              product,
              quantity: orderRow.quantity,
            });
          }
        });
      }

      // Group products by category
      const grouped: Record<ProductCategory, Array<{ product: db.Product; quantity: number }>> = {} as any;
      
      categoryOrder.forEach(category => {
        grouped[category] = [];
      });

      productTotals.forEach(({ product, quantity }) => {
        const category = product.category;
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push({ product, quantity });
      });

      setProductsByCategory(grouped);
      setTotalProducts(productTotals.size);
      setIsLoading(false);
    }

    loadData();
  }, [params]);

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
        <a href="/" className="mt-4 px-6 py-2 bg-purple text-white rounded-md hover:bg-lila transition-colors">
          Terug naar overzicht
        </a>
      </main>
    );
  }

  if (isLoading || !order || !orderId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-purple">Laden...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <h1 className="text-4xl font-bold font-heading text-purple mb-4">Overzicht Bestelling</h1>
      <p className="text-lg text-foreground/70 mb-8">{formatDate(order.date)}</p>
      
      <div className="w-full max-w-4xl space-y-6">
        {categoryOrder.map((category) => {
          const categoryProducts = productsByCategory[category] || [];
          
          if (categoryProducts.length === 0) {
            return null;
          }
          
          return (
            <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-purple">
                <h2 className="text-2xl font-bold font-heading text-white">
                  {categoryDisplayNames[category]}
                </h2>
              </div>
              <div className="px-6 py-4">
                <ul className="space-y-2">
                  {categoryProducts.map(({ product, quantity }) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                    >
                      <span className="text-foreground">{product.name}</span>
                      <span className="font-bold text-purple text-lg">{quantity}x</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
        
        {totalProducts === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-lg text-foreground/60">Geen producten toegevoegd aan deze bestelling</p>
          </div>
        )}
      </div>

      <div className="w-full mt-8 flex md:justify-center md:gap-4">
        <Link
          href={`/bestellingen/${orderId}`}
          className="flex-1 md:flex-none px-6 py-3 bg-beige text-foreground md:rounded-md hover:bg-orange transition-colors text-center"
        >
          Terug naar bestelling
        </Link>
        <Link
          href="/"
          className="flex-1 md:flex-none px-6 py-3 bg-purple text-white md:rounded-md hover:bg-lila transition-colors text-center"
        >
          Terug naar overzicht
        </Link>
      </div>
    </main>
  );
}
