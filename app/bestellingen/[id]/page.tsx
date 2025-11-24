'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById, createOrderList, generateId } from '@/src/db';
import { getAllOrderRows, getAllOrderRowsWithStock } from '@/src/utils';
import { Order, OrderRow } from '@/src/types';
import OrderRowsSummary from '@/src/components/OrderRowsSummary';
import InStock from '@/src/components/InStock';
import Accordion from '@/src/components/Accordion';
import Link from 'next/link';

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [aggregatedRows, setAggregatedRows] = useState<OrderRow[]>([]);
  const [adjustedRows, setAdjustedRows] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);
      const orderData = await getOrderById(orderId);
      
      if (orderData) {
        setOrder(orderData);
        // Get aggregated order rows across all order lists
        const allRows = getAllOrderRows(orderData);
        setAggregatedRows(allRows);
        // Get adjusted rows with inStock subtracted
        const adjusted = getAllOrderRowsWithStock(orderData);
        setAdjustedRows(adjusted);
      }
      
      setIsLoading(false);
    }

    loadOrder();
  }, [orderId]);

  const handleInStockUpdate = async () => {
    // Reload order data when inStock is updated
    const orderData = await getOrderById(orderId);
    if (orderData) {
      setOrder(orderData);
      const allRows = getAllOrderRows(orderData);
      setAggregatedRows(allRows);
      const adjusted = getAllOrderRowsWithStock(orderData);
      setAdjustedRows(adjusted);
    }
  };

  const handleCreateNewOrderList = async (listType: 'Dagopvang' | 'BSO') => {
    setIsCreatingNew(true);
    try {
      const newOrderList = await createOrderList({
        id: generateId(),
        orderId,
        createdAt: new Date(),
        listType,
      });
      router.push(`/bestellingen/${orderId}/${newOrderList.id}`);
    } catch (error) {
      console.error('Failed to create new order list:', error);
      setIsCreatingNew(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-purple text-xl">Laden...</div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Bestelling niet gevonden</div>
          <Link href="/" className="px-6 py-2 bg-purple text-white rounded-md hover:bg-lila transition-colors">
            Terug naar overzicht
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-4xl font-bold font-heading text-purple mb-8">
        Bestelling Details
      </h1>
      
      <div className="w-full space-y-6">
        
      <h2 className="text-3xl font-bold font-heading text-purple">Samenvatting</h2>
        {/* Aggregated Summary with inStock subtracted */}
        <OrderRowsSummary orderRows={adjustedRows} />

        {/* InStock Component */}
        {aggregatedRows.length > 0 && (
          <div className="mt-8">
            <InStock 
              orderId={orderId}
              allOrderProducts={aggregatedRows}
              inStockRows={order.inStock?.orderRows || []}
              inStockOrderListId={order.inStock?.id}
              onUpdate={handleInStockUpdate}
            />
          </div>
        )}

        {/* Individual Order Lists */}
        <div className="mt-8">
          <h2 className="text-3xl font-bold font-heading text-purple mb-4">Bestellijsten</h2>
          
          {order.orderLists.map((orderList, index) => (
            <div key={orderList.id} className="mb-6">
              <Accordion
                title={`Bestellijst ${index + 1}`}
                className="mb-4"
              >
                <div className="space-y-4">
                  <OrderRowsSummary orderRows={orderList.orderRows} />
                  <Link
                    href={`/bestellingen/${orderId}/${orderList.id}`}
                    className="px-4 py-2 bg-purple text-white rounded-md hover:bg-lila transition-colors inline-block mt-4"
                  >
                    Bewerk Bestellijst
                  </Link>
                </div>
              </Accordion>
            </div>
          ))}
          
          {order.orderLists.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-lg text-foreground/60 mb-4">Geen bestellijsten gevonden</p>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() => handleCreateNewOrderList('Dagopvang')}
              disabled={isCreatingNew}
              className="w-full px-6 py-3 bg-purple text-white rounded-md hover:bg-lila transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingNew ? 'Aanmaken...' : 'Nieuwe Bestellijst (Dagopvang)'}
            </button>
            <button
              onClick={() => handleCreateNewOrderList('BSO')}
              disabled={isCreatingNew}
              className="w-full px-6 py-3 bg-purple text-white rounded-md hover:bg-lila transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingNew ? 'Aanmaken...' : 'Nieuwe Bestellijst (BSO)'}
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="px-6 py-3 bg-purple text-white rounded-md hover:bg-lila transition-colors inline-block"
          >
            Terug naar overzicht
          </Link>
        </div>
      </div>
    </main>
  );
}
