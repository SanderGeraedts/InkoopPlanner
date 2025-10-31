import { prisma } from '@/lib/prisma';
import { ProductCategory } from '@prisma/client';
import OrderPageClient from './OrderPageClient';
import { isFirstOrderList, isLastOrderList } from '@/app/actions/orderRow';

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
  searchParams: Promise<{
    orderListId?: string;
  }>;
}

export default async function NewOrder({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { orderListId } = await searchParams;
  
  // Fetch order with its order lists
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
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Get or create the current order list
  let currentOrderList = order.orderLists.find(ol => ol.id === orderListId);
  
  // If no orderListId provided or not found, use the first one or create one
  if (!currentOrderList) {
    if (order.orderLists.length > 0) {
      currentOrderList = order.orderLists[0];
    } else {
      // Create a new order list if none exist
      currentOrderList = await prisma.orderList.create({
        data: {
          orderId: id,
        },
        include: {
          orderRows: {
            include: {
              product: true,
            },
          },
        },
      });
    }
  }

  // Fetch all products
  const products = await prisma.product.findMany({
    orderBy: [
      { category: 'asc' },
    ],
  });

  // Create a map of productId -> quantity from existing orderRows in current order list
  const initialQuantities: Record<string, number> = {};
  if (currentOrderList) {
    currentOrderList.orderRows.forEach(orderRow => {
      initialQuantities[orderRow.productId] = orderRow.quantity;
    });
  }

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<ProductCategory, typeof products>);

  // Check if this is the first and last order list
  const [firstOrderList, lastOrderList] = await Promise.all([
    isFirstOrderList(id, currentOrderList.id),
    isLastOrderList(id, currentOrderList.id),
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="text-4xl font-bold font-heading text-purple m-4 md:m-8">Nieuwe Bestelling</h1>
      
      <OrderPageClient
        orderId={id}
        orderListId={currentOrderList.id}
        initialQuantities={initialQuantities}
        productsByCategory={productsByCategory}
        categoryOrder={categoryOrder}
        categoryDisplayNames={categoryDisplayNames}
        isFirstOrderList={firstOrderList}
        isLastOrderList={lastOrderList}
      />
    </main>
  );
}

