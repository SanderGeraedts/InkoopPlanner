'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  getOrderListById, 
  getAllProducts, 
  createOrderRow, 
  updateOrderRow, 
  deleteOrderRow,
  createOrderList,
  createProduct,
  generateId 
} from '@/src/db';
import type { Product, OrderList, OrderRow, ProductCategory } from '@/src/types';
import { productOrder, categoryDisplayNames, categoryOrder } from '@/src/utils';
import Accordion from '@/src/components/Accordion';

export default function OrderListPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const orderListId = params.orderlistId as string;

  const [orderList, setOrderList] = useState<OrderList | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [isNewOrderList, setIsNewOrderList] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      const [orderListData, allProducts] = await Promise.all([
        getOrderListById(orderListId),
        getAllProducts(),
      ]);

      if (orderListData) {
        setOrderList(orderListData);
        
        // Initialize quantities from existing order rows
        const initialQuantities: Record<string, number> = {};
        orderListData.orderRows.forEach(row => {
          initialQuantities[row.product.id] = row.quantity;
        });
        setQuantities(initialQuantities);
        
        // Determine if this is a new order list (no order rows yet)
        setIsNewOrderList(orderListData.orderRows.length === 0);
      }

      setProducts(allProducts);
      setIsLoading(false);
    }

    loadData();
  }, [orderListId]);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    // Update local state
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity,
    }));

    // Find the product
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Find existing order row
    const existingRow = orderList?.orderRows.find(row => row.product.id === productId);

    if (newQuantity === 0) {
      // Delete the order row if quantity is 0
      if (existingRow) {
        await deleteOrderRow(existingRow.id);
        // Update local state
        setOrderList(prev => {
          if (!prev) return null;
          return {
            ...prev,
            orderRows: prev.orderRows.filter(row => row.id !== existingRow.id),
          };
        });
      }
    } else if (existingRow) {
      // Update existing order row
      await updateOrderRow(existingRow.id, orderListId, {
        product,
        quantity: newQuantity,
      });
      // Update local state
      setOrderList(prev => {
        if (!prev) return null;
        return {
          ...prev,
          orderRows: prev.orderRows.map(row =>
            row.id === existingRow.id ? { ...row, quantity: newQuantity } : row
          ),
        };
      });
    } else {
      // Create new order row
      const newRow = await createOrderRow(orderListId, {
        product,
        quantity: newQuantity,
      });
      // Update local state
      setOrderList(prev => {
        if (!prev) return null;
        return {
          ...prev,
          orderRows: [...prev.orderRows, newRow],
        };
      });
    }
  };

  const handleAddCustomProduct = async () => {
    if (!newProductName.trim()) return;

    try {
      // Create a new product in the Extra's category
      const newProduct: Product = {
        id: generateId(),
        name: newProductName.trim(),
        category: "Extra's",
      };

      // Add product to database
      await createProduct(newProduct);

      // Add to local products state
      setProducts(prev => [...prev, newProduct]);

      // Create order row with quantity 1
      const newRow = await createOrderRow(orderListId, {
        product: newProduct,
        quantity: 1,
      });

      // Update local quantities
      setQuantities(prev => ({
        ...prev,
        [newProduct.id]: 1,
      }));

      // Update order list
      setOrderList(prev => {
        if (!prev) return null;
        return {
          ...prev,
          orderRows: [...prev.orderRows, newRow],
        };
      });

      // Clear input
      setNewProductName('');
    } catch (error) {
      console.error('Failed to add custom product:', error);
    }
  };

  const handleNewOrderList = async () => {
    setIsCreatingNew(true);
    try {
      const newOrderList = await createOrderList({
        id: generateId(),
        orderId,
        createdAt: new Date(),
      });
      router.push(`/bestellingen/${orderId}/${newOrderList.id}`);
    } catch (error) {
      console.error('Failed to create new order list:', error);
      setIsCreatingNew(false);
    }
  };

  const handleFinish = () => {
    router.push(`/bestellingen/${orderId}`);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-purple text-xl">Laden...</div>
      </main>
    );
  }

  if (!orderList) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-red-600 text-xl">Bestellijst niet gevonden</div>
      </main>
    );
  }

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<ProductCategory, Product[]>);

  // Sort products within each category according to productOrder
  Object.keys(productsByCategory).forEach((category) => {
    const cat = category as ProductCategory;
    const order = productOrder[cat] || [];
    
    productsByCategory[cat] = productsByCategory[cat].sort((a, b) => {
      const indexA = order.indexOf(a.name);
      const indexB = order.indexOf(b.name);
      
      // If both products are in the order list, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one is in the order list, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither is in the order list, sort alphabetically
      return a.name.localeCompare(b.name);
    });
  });

  // Determine which categories have products in the order list
  const categoriesWithProducts = new Set(
    orderList?.orderRows.map(row => row.product.category) || []
  );

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-4xl font-bold font-heading text-purple mb-8">Bestellijst</h1>

      <div className="w-full space-y-6">
        {categoryOrder.map(category => {
          const categoryProducts = productsByCategory[category] || [];
          
          // Skip Extra's here, we'll handle it separately below
          if (category === "Extra's") return null;
          
          if (categoryProducts.length === 0) return null;

          // Determine if accordion should be open by default
          const shouldBeOpen = isNewOrderList || categoriesWithProducts.has(category);

          return (
            <Accordion
              key={category}
              title={categoryDisplayNames[category]}
              defaultOpen={shouldBeOpen}
              variant="primary"
            >
              <div className="mt-4">
                <ul className="space-y-3">
                  {categoryProducts.map(product => {
                    const quantity = quantities[product.id] || 0;

                    return (
                      <li
                        key={product.id}
                        className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                      >
                        <span className="text-foreground font-medium flex-1">
                          {product.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(product.id, Math.max(0, quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center bg-beige hover:bg-orange text-purple font-bold rounded-md transition-colors text-2xl"
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
                              handleQuantityChange(product.id, Math.max(0, val));
                            }}
                            className="w-20 h-10 text-center border-2 border-gray-300 rounded-md focus:border-purple focus:outline-none font-bold text-lg"
                          />
                          <button
                            onClick={() => handleQuantityChange(product.id, quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center bg-beige hover:bg-orange text-purple font-bold rounded-md transition-colors text-2xl"
                            aria-label="Verhogen"
                          >
                            +
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Accordion>
          );
        })}

        {/* Extra's Category with Custom Products */}
        <Accordion
          title={categoryDisplayNames["Extra's"]}
          defaultOpen={isNewOrderList || categoriesWithProducts.has("Extra's")}
          variant="primary"
        >
          <div className="space-y-4 mt-4">
            {/* Show existing Extra's products for this order list */}
            {orderList.orderRows
              .filter(row => row.product.category === "Extra's")
              .map(row => {
                const quantity = quantities[row.product.id] || 0;
                return (
                  <div
                    key={row.product.id}
                    className="flex items-center justify-between py-3 border-b border-gray-200"
                  >
                    <span className="text-foreground font-medium flex-1">
                      {row.product.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(row.product.id, Math.max(0, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-beige hover:bg-orange text-purple font-bold rounded-md transition-colors text-2xl"
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
                        className="w-20 h-10 text-center border-2 border-gray-300 rounded-md focus:border-purple focus:outline-none font-bold text-lg"
                      />
                      <button
                        onClick={() => handleQuantityChange(row.product.id, quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-beige hover:bg-orange text-purple font-bold rounded-md transition-colors text-2xl"
                        aria-label="Verhogen"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}

            {/* Add new custom product */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomProduct();
                    }
                  }}
                  placeholder="Nieuw product toevoegen..."
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-md focus:border-purple focus:outline-none"
                />
                <button
                  onClick={handleAddCustomProduct}
                  disabled={!newProductName.trim()}
                  className="px-6 py-2 bg-purple text-white rounded-md hover:bg-lila transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Toevoegen
                </button>
              </div>
            </div>
          </div>
        </Accordion>
      </div>

      <div className="w-full mt-8 flex gap-4 justify-center">
        <button
          onClick={handleFinish}
          className="px-6 py-3 bg-purple text-white rounded-md hover:bg-lila transition-colors font-bold"
        >
          Afronden
        </button>
        <button
          onClick={handleNewOrderList}
          disabled={isCreatingNew}
          className="px-6 py-3 bg-purple text-white rounded-md hover:bg-lila transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreatingNew ? 'Aanmaken...' : 'Nieuwe Bestellijst'}
        </button>
      </div>
    </main>
  );
}
