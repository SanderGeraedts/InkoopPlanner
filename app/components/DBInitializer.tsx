'use client';

import { useEffect, useState } from 'react';
import { seedProducts } from '@/lib/seed';

export default function DBInitializer({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await seedProducts();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setIsReady(true); // Continue anyway
      }
    }
    init();
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-purple">Database initialiseren...</div>
      </div>
    );
  }

  return <>{children}</>;
}
