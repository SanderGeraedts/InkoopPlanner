'use client';

import { useEffect, useState } from 'react';
import { seedProducts } from '@/src/db/seedClient';

const DB_INITIALIZED_KEY = 'inkoop-planner-db-initialized';

export default function DBInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initDB() {
      try {
        // Check if already initialized in this browser session
        const alreadyInitialized = localStorage.getItem(DB_INITIALIZED_KEY);
        
        if (!alreadyInitialized) {
          await seedProducts();
          localStorage.setItem(DB_INITIALIZED_KEY, 'true');
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        // Still set as initialized to allow app to load
        setIsInitialized(true);
      }
    }

    initDB();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-purple text-xl font-bold mb-2">Database initialiseren...</div>
          <div className="text-foreground/60">Even geduld...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
