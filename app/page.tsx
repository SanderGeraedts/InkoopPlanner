'use client';

import Link from 'next/link';
import { formatDate } from '@/src/utils';
import { useEffect, useState } from 'react';
import { getAllOrders } from '@/src/db';
import type { Order } from '@/src/types';
import DeleteOrderButton from '@/src/components/DeleteOrderButton';

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  

  useEffect(() => {
    async function loadOrders() {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
    }
    loadOrders();
  }, []);

  const handleOrderDeleted = () => {
    // Reload orders after deletion
    async function reloadOrders() {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
    }
    reloadOrders();
  };

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-4xl font-bold font-heading text-purple mb-8">Bestellingen</h1>
      
      <div className="w-full space-y-4">

        {orders.length === 0 ? (
          <p className="text-lg text-center text-foreground/60">Geen bestellingen gevonden</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-between p-6 gap-4"
            >
              <div className="flex items-center gap-3 flex-1">
                <Link
                  href={`/bestellingen/${order.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <h2 className="text-xl font-bold font-heading text-purple">
                    Bestelling van {formatDate(order.date)}
                  </h2>
                </Link>
                <DeleteOrderButton orderId={order.id} onDeleted={handleOrderDeleted} />
              </div>
              <Link
                href={`/bestellingen/${order.id}`}
                className="px-4 py-2 bg-purple text-white rounded-md hover:bg-lila transition-colors"
              >
                Details
              </Link>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
