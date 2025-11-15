type ProductCategory = "Drinken" | "Brood en Beleg" | "Tussendoor" | "Aanvullend beperkt" | "Groenten en Fruit" | "Overigen producten" | "Extra's";

type Product = {
  id: string;
  name: string;
  category: ProductCategory;
};

type Order = {
    id: string;
    date: Date;
    orderLists: OrderList[];
};

type OrderRow = {
    id: string;
    product: Product;
    quantity: number;
};

type OrderList = {
    id: string;
    orderId: string;
    createdAt: Date;
    orderRows: OrderRow[];
};

export type { Product, Order, OrderRow, OrderList, ProductCategory };