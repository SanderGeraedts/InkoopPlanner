'use client';

import { useState } from 'react';
import { Product } from '@prisma/client';
import { addProductToExtras, deleteProduct } from '@/app/actions/product';
import { useRouter } from 'next/navigation';
import QuantityControl from '@/app/components/QuantityControl';

interface CategoryAccordionProps {
  category: string;
  products: Product[];
  isOpen: boolean;
  onToggle: () => void;
  isExtras?: boolean;
  orderId: string;
  initialQuantities: Record<string, number>;
  onQuantityChange: (productId: string, quantity: number) => void;
}

export default function CategoryAccordion({ category, products, isOpen, onToggle, isExtras = false, orderId, initialQuantities, onQuantityChange }: CategoryAccordionProps) {
  const [newProductName, setNewProductName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Always show Extras category, even if empty
  if (!isExtras && products.length === 0) {
    return null;
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || isAdding) return;

    setIsAdding(true);
    try {
      const result = await addProductToExtras(newProductName.trim());
      if (result.success) {
        setNewProductName('');
        router.refresh();
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteProduct = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(productId));
    try {
      const result = await deleteProduct(productId);
      if (result.success) {
        router.refresh();
      } else {
        console.error('Failed to delete product');
        setDeletingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between transition-colors"
      >
        <h2 className="text-2xl font-bold font-heading text-purple">
          {category}
        </h2>
        <svg
          className={`w-6 h-6 text-purple transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <ul className="space-y-2">
            {products.map((product) => (
              <li
                key={product.id}
                className="w-full p-3 rounded-md bg-beige hover:bg-orange transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4"
              >
                <div className="flex items-center gap-2 flex-1">
                  {isExtras && (
                    <button
                      onClick={(e) => handleDeleteProduct(product.id, e)}
                      disabled={deletingIds.has(product.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      aria-label="Product verwijderen"
                      title="Verwijder product"
                    >
                      {deletingIds.has(product.id) ? (
                        <svg
                          className="animate-spin h-4 w-4"
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
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                  <span className="text-foreground font-medium">{product.name}</span>
                </div>
                <div className="flex justify-center md:justify-start">
                  <QuantityControl
                    productId={product.id}
                    initialQuantity={initialQuantities[product.id] || 0}
                    onQuantityChange={onQuantityChange}
                  />
                </div>
              </li>
            ))}
          </ul>
          {isExtras && (
            <form onSubmit={handleAddProduct} className="mt-4">
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Nieuw product toevoegen..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                  disabled={isAdding}
                />
                <button
                  type="submit"
                  disabled={!newProductName.trim() || isAdding}
                  className="px-4 py-2 bg-purple text-white rounded-md hover:bg-lila transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {isAdding ? (
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
                  ) : (
                    'Toevoegen'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

