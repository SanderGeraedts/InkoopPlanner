'use client';

import { createOrder } from '@/app/actions/order';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddOrderButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateOrder = async () => {
    setIsLoading(true);
    try {
      const result = await createOrder();
        setIsLoading(false);
      if (result.success && result.orderId) {
        router.push(`/bestellingen/${result.orderId}`);
      } else {
        console.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <button
      onClick={handleCreateOrder}
      disabled={isLoading}
      className="px-6 py-2 bg-white text-purple rounded-md hover:bg-beige transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      aria-label="Nieuwe bestelling toevoegen"
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Aanmaken...</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Nieuwe Bestelling</span>
        </>
      )}
    </button>
  );
}

