import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteOrderButton from './components/DeleteOrderButton';

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

export default async function Home() {
  const [orders] = await Promise.all([
    prisma.order.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        orderLists: {
          include: {
            orderRows: true,
          },
        },
      },
    }),
  ]);

  const dbContent = {
    orders
  };

  return (
    <main className="flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold font-heading text-purple mb-8">Bestellingen</h1>
      
      <div className="w-full max-w-4xl space-y-4">
        {orders.length === 0 ? (
          <p className="text-lg text-center text-foreground/60">Geen bestellingen gevonden</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-between p-6 gap-4"
            >
              <Link
                href={`/bestellingen/${order.id}`}
                className="flex-1 cursor-pointer"
              >
                <h2 className="text-xl font-bold font-heading text-purple">
                  Bestelling van {formatDate(order.date)}
                </h2>
              </Link>
              <Link
                href={`/bestellingen/${order.id}/overzicht`}
                className="px-4 py-2 bg-purple text-white rounded-md hover:bg-lila transition-colors"
              >
                Overzicht
              </Link>
              <DeleteOrderButton orderId={order.id} />
            </div>
          ))
        )}
      </div>
    </main>
  );
}
