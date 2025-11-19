'use client';

import { useState, useEffect } from 'react';
import { OrderRow, ProductCategory } from '@/src/types';
import { 
  createOrderRow, 
  updateOrderRow, 
  deleteOrderRow,
  createOrderList,
  generateId,
  updateOrder
} from '@/src/db';
import { productOrder, categoryDisplayNames, categoryOrder } from '@/src/utils';
import Accordion from './Accordion';

interface InStockProps {
  orderId: string;
  allOrderProducts: OrderRow[]; // All products from order lists
  inStockRows: OrderRow[]; // Current inStock quantities
  inStockOrderListId?: string;
  onUpdate: () => void;
}

export default function InStock({ orderId, allOrderProducts, inStockRows, inStockOrderListId, onUpdate }: InStockProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [inStockListId, setInStockListId] = useState<string | undefined>(inStockOrderListId);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // Initialize quantities from existing inStock order rows (not from all order products)
    const initialQuantities: Record<string, number> = {};
    inStockRows.forEach(row => {
      initialQuantities[row.product.id] = row.quantity;
    });
    setQuantities(initialQuantities);
  }, [inStockRows]);

  const ensureInStockList = async (): Promise<string> => {
    if (inStockListId) return inStockListId;

    setIsInitializing(true);
    try {
      // Create an inStock order list
      const newInStockList = await createOrderList({
        id: generateId(),
        orderId: orderId,
        createdAt: new Date(),
      });

      // Update the order to reference this inStock list
      const order = await import('@/src/db').then(db => db.getOrderById(orderId));
      if (order) {
        await updateOrder({
          ...order,
          inStock: newInStockList,
        });
      }

      setInStockListId(newInStockList.id);
      onUpdate(); // Trigger parent update so it reloads with the new inStock
      return newInStockList.id;
    } finally {
      setIsInitializing(false);
    }
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    // Update local state immediately
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity,
    }));

    // Ensure we have an inStock list
    const listId = await ensureInStockList();

    // Find the product from allOrderProducts
    const orderRow = allOrderProducts.find(row => row.product.id === productId);
    if (!orderRow) return;

    // Find existing inStock row
    const existingRow = inStockRows.find(row => row.product.id === productId);

    if (newQuantity === 0) {
      // Delete the order row if quantity is 0
      if (existingRow) {
        await deleteOrderRow(existingRow.id);
        onUpdate();
      }
    } else if (existingRow) {
      // Update existing order row
      await updateOrderRow(existingRow.id, listId, {
        product: orderRow.product,
        quantity: newQuantity,
      });
      onUpdate();
    } else {
      // Create new order row
      await createOrderRow(listId, {
        product: orderRow.product,
        quantity: newQuantity,
      });
      onUpdate();
    }
  };

  // Group products by category (use allOrderProducts to show all available products)
  const rowsByCategory = allOrderProducts.reduce((acc, row) => {
    const category = row.product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(row);
    return acc;
  }, {} as Record<ProductCategory, OrderRow[]>);

  // Sort products within each category
  const sortedRowsByCategory: Record<ProductCategory, OrderRow[]> = {} as any;
  
  Object.keys(rowsByCategory).forEach((category) => {
    const cat = category as ProductCategory;
    const rows = rowsByCategory[cat];
    const order = productOrder[cat] || [];
    
    sortedRowsByCategory[cat] = rows.sort((a, b) => {
      const indexA = order.indexOf(a.product.name);
      const indexB = order.indexOf(b.product.name);
      
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      return a.product.name.localeCompare(b.product.name);
    });
  });

  return (
    <div className="w-full space-y-6">
      <h2 className="text-3xl font-bold font-heading text-purple">Nog op voorraad</h2>
      
      {categoryOrder.map((category) => {
        const categoryRows = sortedRowsByCategory[category] || [];
        
        if (categoryRows.length === 0) {
          return null;
        }
        
        return (
          <Accordion
            key={category}
            title={categoryDisplayNames[category]}
            defaultOpen={false}
            variant="primary"
          >
            <ul className="space-y-2 mt-4">
              {categoryRows.map((row) => {
                const quantity = quantities[row.product.id] || 0;
                
                return (
                  <li
                    key={row.product.id}
                    className="flex items-center justify-between py-2 px-4 bg-beige rounded-md"
                  >
                    <span className="text-foreground">{row.product.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(row.product.id, Math.max(0, quantity - 1))}
                        disabled={isInitializing}
                        className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 text-purple font-bold rounded-md transition-colors text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Verminderen"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          handleQuantityChange(row.product.id, Math.max(0, val));
                        }}
                        disabled={isInitializing}
                        className="w-20 h-10 text-center border-2 border-gray-300 rounded-md focus:border-purple focus:outline-none font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        onClick={() => handleQuantityChange(row.product.id, quantity + 1)}
                        disabled={isInitializing}
                        className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 text-purple font-bold rounded-md transition-colors text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Verhogen"
                      >
                        +
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Accordion>
        );
      })}
      
      {allOrderProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-lg text-foreground/60">Nog geen producten toegevoegd aan bestellingen</p>
        </div>
      )}
    </div>
  );
}
