type Product = {
  id: string;
  name: string;
  category: "Drinken" | "Brood en Beleg" | "Tussendoor" | "Aanvullend beperkt" | "Groenten en Fruit" | "Overigen producten" | "Extra's";
};

type Order = {
    id: string;
    date: Date;
    products: OrderRow[];
};

type OrderRow = {
    product: Product;
    quantity: number;
};

export type { Product, Order, OrderRow };