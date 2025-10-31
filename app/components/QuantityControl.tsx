'use client';

import { useEffect, useState } from 'react';

interface QuantityControlProps {
  productId: string;
  initialQuantity: number;
  onQuantityChange: (productId: string, quantity: number) => void;
}

export default function QuantityControl({ productId, initialQuantity, onQuantityChange }: QuantityControlProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleChange = (newQuantity: number) => {
    const clampedQuantity = Math.max(0, newQuantity);
    setQuantity(clampedQuantity);
    onQuantityChange(productId, clampedQuantity);
  };

  const increment = () => handleChange(quantity + 1);
  const decrement = () => handleChange(quantity - 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    handleChange(value);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={decrement}
        className="w-8 h-8 flex items-center justify-center bg-purple text-white rounded hover:bg-lila transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={quantity <= 0}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <input
        type="number"
        min="0"
        value={quantity}
        onChange={handleInputChange}
        className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
      />
      <button
        type="button"
        onClick={increment}
        className="w-8 h-8 flex items-center justify-center bg-purple text-white rounded hover:bg-lila transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

