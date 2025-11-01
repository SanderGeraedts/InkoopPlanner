'use client';

import { useState, useEffect } from 'react';
import * as db from '@/lib/db';

export function useDB() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    db.getDB().then(() => setIsReady(true));
  }, []);

  return { isReady, db };
}
