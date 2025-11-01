import { openDB, DBSchema, IDBPDatabase } from 'idb';

export enum ProductCategory {
  Drinken = 'Drinken',
  Brood_en_Beleg = 'Brood_en_Beleg',
  Tussendoor = 'Tussendoor',
  Aanvullend_beperkt = 'Aanvullend_beperkt',
  Groenten_en_Fruit = 'Groenten_en_Fruit',
  Overigen_producten = 'Overigen_producten',
  Extras = 'Extras',
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  image: string | null;
}

export interface Order {
  id: string;
  date: Date;
}

export interface OrderList {
  id: string;
  orderId: string;
  createdAt: Date;
}

export interface OrderRow {
  id: string;
  orderListId: string;
  productId: string;
  quantity: number;
}

interface InkoopPlannerDB extends DBSchema {
  products: {
    key: string;
    value: Product;
    indexes: { 'by-category': string };
  };
  orders: {
    key: string;
    value: Order;
    indexes: { 'by-date': Date };
  };
  orderLists: {
    key: string;
    value: OrderList;
    indexes: { 'by-orderId': string; 'by-createdAt': Date };
  };
  orderRows: {
    key: string;
    value: OrderRow;
    indexes: { 'by-orderListId': string; 'by-productId': string };
  };
}

let dbInstance: IDBPDatabase<InkoopPlannerDB> | null = null;

export async function getDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<InkoopPlannerDB>('inkoop-planner', 1, {
    upgrade(db) {
      // Products store
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id' });
        productStore.createIndex('by-category', 'category');
      }

      // Orders store
      if (!db.objectStoreNames.contains('orders')) {
        const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
        orderStore.createIndex('by-date', 'date');
      }

      // OrderLists store
      if (!db.objectStoreNames.contains('orderLists')) {
        const orderListStore = db.createObjectStore('orderLists', { keyPath: 'id' });
        orderListStore.createIndex('by-orderId', 'orderId');
        orderListStore.createIndex('by-createdAt', 'createdAt');
      }

      // OrderRows store
      if (!db.objectStoreNames.contains('orderRows')) {
        const orderRowStore = db.createObjectStore('orderRows', { keyPath: 'id' });
        orderRowStore.createIndex('by-orderListId', 'orderListId');
        orderRowStore.createIndex('by-productId', 'productId');
      }
    },
  });

  return dbInstance;
}

// Helper function to generate UUIDs
export function generateId(): string {
  return crypto.randomUUID();
}

// Product operations
export async function getAllProducts() {
  const db = await getDB();
  return db.getAll('products');
}

export async function getProductById(id: string) {
  const db = await getDB();
  return db.get('products', id);
}

export async function createProduct(product: Omit<Product, 'id'>) {
  const db = await getDB();
  const newProduct: Product = {
    ...product,
    id: generateId(),
  };
  await db.add('products', newProduct);
  return newProduct;
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const db = await getDB();
  const existing = await db.get('products', id);
  if (!existing) throw new Error('Product not found');
  const updated = { ...existing, ...product };
  await db.put('products', updated);
  return updated;
}

export async function deleteProduct(id: string) {
  const db = await getDB();
  await db.delete('products', id);
}

export async function deleteAllProducts() {
  const db = await getDB();
  await db.clear('products');
}

// Order operations
export async function getAllOrders() {
  const db = await getDB();
  const orders = await db.getAll('orders');
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getOrderById(id: string) {
  const db = await getDB();
  return db.get('orders', id);
}

export async function createOrder(order: Omit<Order, 'id'>) {
  const db = await getDB();
  const newOrder: Order = {
    ...order,
    id: generateId(),
  };
  await db.add('orders', newOrder);
  return newOrder;
}

export async function deleteOrder(id: string) {
  const db = await getDB();
  
  // Delete all order lists for this order
  const orderLists = await getOrderListsByOrderId(id);
  for (const orderList of orderLists) {
    await deleteOrderList(orderList.id);
  }
  
  await db.delete('orders', id);
}

// OrderList operations
export async function getOrderListsByOrderId(orderId: string) {
  const db = await getDB();
  return db.getAllFromIndex('orderLists', 'by-orderId', orderId);
}

export async function getOrderListById(id: string) {
  const db = await getDB();
  return db.get('orderLists', id);
}

export async function createOrderList(orderList: Omit<OrderList, 'id' | 'createdAt'>) {
  const db = await getDB();
  const newOrderList: OrderList = {
    ...orderList,
    id: generateId(),
    createdAt: new Date(),
  };
  await db.add('orderLists', newOrderList);
  return newOrderList;
}

export async function deleteOrderList(id: string) {
  const db = await getDB();
  
  // Delete all order rows for this order list
  const orderRows = await getOrderRowsByOrderListId(id);
  for (const orderRow of orderRows) {
    await deleteOrderRow(orderRow.id);
  }
  
  await db.delete('orderLists', id);
}

// OrderRow operations
export async function getOrderRowsByOrderListId(orderListId: string) {
  const db = await getDB();
  return db.getAllFromIndex('orderRows', 'by-orderListId', orderListId);
}

export async function getOrderRowById(id: string) {
  const db = await getDB();
  return db.get('orderRows', id);
}

export async function createOrderRow(orderRow: Omit<OrderRow, 'id'>) {
  const db = await getDB();
  const newOrderRow: OrderRow = {
    ...orderRow,
    id: generateId(),
  };
  await db.add('orderRows', newOrderRow);
  return newOrderRow;
}

export async function updateOrderRow(id: string, orderRow: Partial<OrderRow>) {
  const db = await getDB();
  const existing = await db.get('orderRows', id);
  if (!existing) throw new Error('OrderRow not found');
  const updated = { ...existing, ...orderRow };
  await db.put('orderRows', updated);
  return updated;
}

export async function deleteOrderRow(id: string) {
  const db = await getDB();
  await db.delete('orderRows', id);
}

export async function deleteOrderRowsByOrderListId(orderListId: string) {
  const db = await getDB();
  const orderRows = await getOrderRowsByOrderListId(orderListId);
  for (const orderRow of orderRows) {
    await db.delete('orderRows', orderRow.id);
  }
}
