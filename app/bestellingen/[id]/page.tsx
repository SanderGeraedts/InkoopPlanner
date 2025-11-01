'use client';

import * as db from '@/lib/db';
import { ProductCategory } from '@/types';
import OrderPageClient from './OrderPageClient';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

// Map category enum to display names
const categoryDisplayNames: Record<ProductCategory, string> = {
  Drinken: 'Drinken',
  Brood_en_Beleg: 'Brood en Beleg',
  Tussendoor: 'Tussendoor',
  Aanvullend_beperkt: 'Aanvullend Beperkt',
  Groenten_en_Fruit: 'Groenten en Fruit',
  Overigen_producten: 'Overige Producten',
  Extras: 'Extra\'s',
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

export default function NewOrder({ params }: PageProps) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [currentOrderList, setCurrentOrderList] = useState<db.OrderList | null>(null);
  const [initialQuantities, setInitialQuantities] = useState<Record<string, number>>({});
  const [productsByCategory, setProductsByCategory] = useState<Record<ProductCategory, db.Product[]>>({} as Record<ProductCategory, db.Product[]>);
  const [isFirstOrderList, setIsFirstOrderList] = useState(false);
  const [isLastOrderList, setIsLastOrderList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const searchParams = useSearchParams();
  const orderListId = searchParams.get('orderListId');

  const handleProductsChange = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setOrderId(id);

      // Fetch order with its order lists
      const order = await db.getOrderById(id);
      if (!order) {
        console.error('Order not found:', id);
        setError('Bestelling niet gevonden');
        setIsLoading(false);
        return;
      }

      const orderLists = await db.getOrderListsByOrderId(id);

      // Get or create the current order list
      let currentList = orderLists.find(ol => ol.id === orderListId);
      
      // If no orderListId provided or not found, use the first one or create one
      if (!currentList) {
        if (orderLists.length > 0) {
          currentList = orderLists[0];
        } else {
          // Create a new order list if none exist
          currentList = await db.createOrderList({ orderId: id });
        }
      }

      setCurrentOrderList(currentList);

      // Fetch all products
      const products = await db.getAllProducts();

      // Create a map of productId -> quantity from existing orderRows in current order list
      const quantities: Record<string, number> = {};
      if (currentList) {
        const orderRows = await db.getOrderRowsByOrderListId(currentList.id);
        orderRows.forEach(orderRow => {
          quantities[orderRow.productId] = orderRow.quantity;
        });
      }
      setInitialQuantities(quantities);

      // Group products by category
      const grouped = products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {} as Record<ProductCategory, db.Product[]>);
      setProductsByCategory(grouped);

      // Check if this is the first and last order list
      if (currentList) {
        const sortedOrderLists = orderLists.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setIsFirstOrderList(sortedOrderLists[0]?.id === currentList.id);
        setIsLastOrderList(sortedOrderLists[sortedOrderLists.length - 1]?.id === currentList.id);
      }

      setIsLoading(false);
    }

    loadData();
  }, [params, orderListId, refreshTrigger]);

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

  if (isLoading || !currentOrderList || !orderId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-purple">Laden...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="text-4xl font-bold font-heading text-purple m-4 md:m-8">Nieuwe Bestelling</h1>
      
      <OrderPageClient
        orderId={orderId}
        orderListId={currentOrderList.id}
        initialQuantities={initialQuantities}
        productsByCategory={productsByCategory}
        categoryOrder={categoryOrder}
        categoryDisplayNames={categoryDisplayNames}
        isFirstOrderList={isFirstOrderList}
        isLastOrderList={isLastOrderList}
        onProductsChange={handleProductsChange}
      />
    </main>
  );
}

