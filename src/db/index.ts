import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Product, Order, OrderList, OrderRow, ProductCategory } from '@/src/types';

// Define the database schema
interface InkoopPlannerDB extends DBSchema {
  products: {
    key: string;
    value: Product;
    indexes: { 'by-category': ProductCategory };
  };
  orders: {
    key: string;
    value: Order;
    indexes: { 'by-date': Date };
  };
  orderLists: {
    key: string;
    value: OrderList;
    indexes: { 'by-orderId': string };
  };
  orderRows: {
    key: string;
    value: OrderRow & { orderListId: string };
    indexes: { 'by-orderListId': string; 'by-productId': string };
  };
}

const DB_NAME = 'inkoop-planner-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<InkoopPlannerDB> | null = null;

// Initialize and get database instance
export async function getDB(): Promise<IDBPDatabase<InkoopPlannerDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<InkoopPlannerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create products store
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id' });
        productStore.createIndex('by-category', 'category');
      }

      // Create orders store
      if (!db.objectStoreNames.contains('orders')) {
        const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
        orderStore.createIndex('by-date', 'date');
      }

      // Create orderLists store
      if (!db.objectStoreNames.contains('orderLists')) {
        const orderListStore = db.createObjectStore('orderLists', { keyPath: 'id' });
        orderListStore.createIndex('by-orderId', 'orderId');
      }

      // Create orderRows store
      if (!db.objectStoreNames.contains('orderRows')) {
        const orderRowStore = db.createObjectStore('orderRows', { keyPath: 'id' });
        orderRowStore.createIndex('by-orderListId', 'orderListId');
        orderRowStore.createIndex('by-productId', 'product.id');
      }
    },
  });

  return dbInstance;
}

// Helper to generate unique IDs
export function generateId(): string {
  return crypto.randomUUID();
}

// ==================== PRODUCT OPERATIONS ====================

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDB();
  return db.getAll('products');
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const db = await getDB();
  return db.get('products', id);
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  const db = await getDB();
  return db.getAllFromIndex('products', 'by-category', category);
}

export async function createProduct(product: Product): Promise<void> {
  const db = await getDB();
  await db.add('products', product);
}

export async function updateProduct(product: Product): Promise<void> {
  const db = await getDB();
  await db.put('products', product);
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('products', id);
}

// ==================== ORDER OPERATIONS ====================

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDB();
  const orders = await db.getAll('orders');
  
  // Fetch orderLists and inStock for each order
  for (const order of orders) {
    const allOrderLists = await getOrderListsByOrderId(order.id);
    
    // Filter out inStock from orderLists
    if (order.inStock) {
      order.orderLists = allOrderLists.filter(ol => ol.id !== order.inStock?.id);
      const inStock = await getOrderListById(order.inStock.id);
      if (inStock) {
        order.inStock = inStock;
      }
    } else {
      order.orderLists = allOrderLists;
    }
  }
  
  return orders;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const db = await getDB();
  const order = await db.get('orders', id);
  
  if (order) {
    const allOrderLists = await getOrderListsByOrderId(id);
    
    // Filter out inStock from orderLists
    if (order.inStock) {
      order.orderLists = allOrderLists.filter(ol => ol.id !== order.inStock?.id);
      const inStock = await getOrderListById(order.inStock.id);
      if (inStock) {
        order.inStock = inStock;
      }
    } else {
      order.orderLists = allOrderLists;
    }
  }
  
  return order;
}

export async function createOrder(order: Omit<Order, 'orderLists'>): Promise<Order> {
  const db = await getDB();
  const newOrder: Order = {
    ...order,
    orderLists: [],
    inStock: order.inStock,
  };
  await db.add('orders', newOrder);
  return newOrder;
}

export async function updateOrder(order: Order): Promise<void> {
  const db = await getDB();
  await db.put('orders', order);
}

export async function deleteOrder(id: string): Promise<void> {
  const db = await getDB();
  
  // Delete all order lists for this order
  const orderLists = await getOrderListsByOrderId(id);
  for (const orderList of orderLists) {
    await deleteOrderList(orderList.id);
  }
  
  await db.delete('orders', id);
}

// ==================== ORDER LIST OPERATIONS ====================

export async function getOrderListsByOrderId(orderId: string): Promise<OrderList[]> {
  const db = await getDB();
  const orderLists = await db.getAllFromIndex('orderLists', 'by-orderId', orderId);
  
  // Fetch orderRows for each orderList
  for (const orderList of orderLists) {
    orderList.orderRows = await getOrderRowsByOrderListId(orderList.id);
  }
  
  return orderLists;
}

export async function getOrderListById(id: string): Promise<OrderList | undefined> {
  const db = await getDB();
  const orderList = await db.get('orderLists', id);
  
  if (orderList) {
    orderList.orderRows = await getOrderRowsByOrderListId(id);
  }
  
  return orderList;
}

export async function createOrderList(orderList: Omit<OrderList, 'orderRows'>): Promise<OrderList> {
  const db = await getDB();
  const newOrderList: OrderList = {
    ...orderList,
    orderRows: [],
    listType: orderList.listType,
  };
  await db.add('orderLists', newOrderList);
  return newOrderList;
}

export async function updateOrderList(orderList: OrderList): Promise<void> {
  const db = await getDB();
  await db.put('orderLists', orderList);
}

export async function deleteOrderList(id: string): Promise<void> {
  const db = await getDB();
  
  // Delete all order rows for this order list
  const orderRows = await getOrderRowsByOrderListId(id);
  for (const orderRow of orderRows) {
    await deleteOrderRow(orderRow.id);
  }
  
  await db.delete('orderLists', id);
}

// ==================== ORDER ROW OPERATIONS ====================

export async function getOrderRowsByOrderListId(orderListId: string): Promise<OrderRow[]> {
  const db = await getDB();
  const rows = await db.getAllFromIndex('orderRows', 'by-orderListId', orderListId);
  
  // Remove the orderListId field to match OrderRow type
  return rows.map(({ orderListId, ...orderRow }) => orderRow as OrderRow);
}

export async function getOrderRowById(id: string): Promise<OrderRow | undefined> {
  const db = await getDB();
  const row = await db.get('orderRows', id);
  
  if (row) {
    const { orderListId: _, ...orderRow } = row;
    return orderRow as OrderRow;
  }
  
  return undefined;
}

export async function createOrderRow(
  orderListId: string,
  orderRow: Omit<OrderRow, 'id'>
): Promise<OrderRow> {
  const db = await getDB();
  const newOrderRow: OrderRow = {
    id: generateId(),
    ...orderRow,
  };
  const rowWithOrderListId = {
    ...newOrderRow,
    orderListId,
  };
  await db.add('orderRows', rowWithOrderListId);
  return newOrderRow;
}

export async function updateOrderRow(
  id: string,
  orderListId: string,
  orderRow: Omit<OrderRow, 'id'>
): Promise<void> {
  const db = await getDB();
  const updatedRow: OrderRow = {
    id,
    ...orderRow,
  };
  const rowWithOrderListId = {
    ...updatedRow,
    orderListId,
  };
  await db.put('orderRows', rowWithOrderListId);
}

export async function deleteOrderRow(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('orderRows', id);
}

export async function deleteOrderRowsByOrderListId(orderListId: string): Promise<void> {
  const db = await getDB();
  const rows = await db.getAllFromIndex('orderRows', 'by-orderListId', orderListId);
  
  for (const row of rows) {
    await db.delete('orderRows', row.id);
  }
}
