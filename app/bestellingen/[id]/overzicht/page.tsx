import { prisma } from '@/lib/prisma';
import { ProductCategory } from '@prisma/client';
import Link from 'next/link';

// Map Prisma category enum to display names
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
  'Drinken',
  'Brood_en_Beleg',
  'Tussendoor',
  'Aanvullend_beperkt',
  'Groenten_en_Fruit',
  'Overigen_producten',
  'Extras',
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

export default async function OrderOverview({ params }: PageProps) {
  const { id } = await params;
  
  // Fetch order with all its order lists and order rows
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderLists: {
        include: {
          orderRows: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Aggregate quantities by product across all order lists
  const productTotals = new Map<string, { product: any; quantity: number }>();
  
  order.orderLists.forEach(orderList => {
    orderList.orderRows.forEach(orderRow => {
      const existing = productTotals.get(orderRow.productId);
      if (existing) {
        existing.quantity += orderRow.quantity;
      } else {
        productTotals.set(orderRow.productId, {
          product: orderRow.product,
          quantity: orderRow.quantity,
        });
      }
    });
  });

  // Group products by category
  const productsByCategory: Record<ProductCategory, Array<{ product: any; quantity: number }>> = {} as any;
  
  categoryOrder.forEach(category => {
    productsByCategory[category] = [];
  });

  productTotals.forEach(({ product, quantity }) => {
    const category = product.category as ProductCategory;
    if (!productsByCategory[category]) {
      productsByCategory[category] = [];
    }
    productsByCategory[category].push({ product, quantity });
  });

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
        
        {Array.from(productTotals.values()).length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-lg text-foreground/60">Geen producten toegevoegd aan deze bestelling</p>
          </div>
        )}
      </div>

      <div className="w-full mt-8 flex md:justify-center md:gap-4">
        <Link
          href={`/bestellingen/${id}`}
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
