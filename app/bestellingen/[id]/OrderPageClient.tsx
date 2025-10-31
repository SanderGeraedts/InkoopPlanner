'use client';

import { useState, useCallback, useEffect } from 'react';
import { Product, ProductCategory } from '@prisma/client';
import CategoryAccordion from './CategoryAccordion';
import OrderActions from '@/app/components/OrderActions';

interface OrderPageClientProps {
  orderId: string;
  orderListId: string;
  initialQuantities: Record<string, number>;
  productsByCategory: Record<ProductCategory, Product[]>;
  categoryOrder: ProductCategory[];
  categoryDisplayNames: Record<ProductCategory, string>;
  isFirstOrderList: boolean;
  isLastOrderList: boolean;
}

export default function OrderPageClient({
  orderId,
  orderListId,
  initialQuantities,
  productsByCategory,
  categoryOrder,
  categoryDisplayNames,
  isFirstOrderList,
  isLastOrderList,
}: OrderPageClientProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(initialQuantities);
  const [isSaved, setIsSaved] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);
  const [openCategories, setOpenCategories] = useState<Set<ProductCategory>>(new Set());

  // Update quantities and accordion states when initialQuantities change (e.g., after navigation)
  useEffect(() => {
    if (shouldReset) {
      // Reset all quantities to 0 after refresh
      // Get all product IDs from productsByCategory
      const resetQuantities: Record<string, number> = {};
      Object.values(productsByCategory).forEach(products => {
        products.forEach(product => {
          resetQuantities[product.id] = 0;
        });
      });
      setQuantities(resetQuantities);
      setShouldReset(false);
      // Open all categories when reset
      setOpenCategories(new Set(categoryOrder));
    } else {
      setQuantities(initialQuantities);
      
      // Check if any product has a quantity > 0
      const hasAnyQuantity = Object.values(initialQuantities).some(qty => qty > 0);
      
      if (hasAnyQuantity) {
        // Determine which categories have products with quantities > 0
        const categoriesToOpen = new Set<ProductCategory>();
        categoryOrder.forEach(category => {
          const categoryProducts = productsByCategory[category] || [];
          const hasQuantity = categoryProducts.some(product => 
            (initialQuantities[product.id] || 0) > 0
          );
          if (hasQuantity) {
            categoriesToOpen.add(category);
          }
        });
        setOpenCategories(categoriesToOpen);
      } else {
        // No products added yet, open all categories
        setOpenCategories(new Set(categoryOrder));
      }
    }
  }, [initialQuantities, shouldReset, productsByCategory, categoryOrder]);

  const handleQuantityChange = useCallback((productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity,
    }));
    setIsSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    setIsSaved(true);
  }, []);

  const handleReset = useCallback(() => {
    // Mark that we should reset after refresh
    setShouldReset(true);
    setIsSaved(false);
  }, []);

  const toggleCategory = useCallback((category: ProductCategory) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  return (
    <>
      <div className="w-full max-w-6xl space-y-4 px-4 md:px-8">
        {categoryOrder.map((category) => {
          const categoryProducts = productsByCategory[category] || [];
          const isExtras = category === 'Extras';
          
          return (
            <CategoryAccordion
              key={category}
              category={categoryDisplayNames[category]}
              products={categoryProducts}
              isOpen={openCategories.has(category)}
              onToggle={() => toggleCategory(category)}
              isExtras={isExtras}
              orderId={orderId}
              initialQuantities={quantities}
              onQuantityChange={handleQuantityChange}
            />
          );
        })}
      </div>
      <OrderActions
        orderId={orderId}
        orderListId={orderListId}
        quantities={quantities}
        onSave={handleSave}
        onReset={handleReset}
        isFirstOrderList={isFirstOrderList}
        isLastOrderList={isLastOrderList}
      />
    </>
  );
}

