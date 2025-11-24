type ProductCategory = "Drinken" | "Brood" | "Beleg" | "Tussendoor" | "Groente en Overige" | "Diepvries fruit en Ijs" | "Thee" | "Producten buiten voedingsbeleid" | "Extra's";

type Product = {
  id: string;
  name: string;
  category: ProductCategory;
};

type Order = {
    id: string;
    date: Date;
    orderLists: OrderList[];
    inStock?: OrderList;
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
    listType: "Dagopvang" | "BSO"
};

export type { Product, Order, OrderRow, OrderList, ProductCategory };