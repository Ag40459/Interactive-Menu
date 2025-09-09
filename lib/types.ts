export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type CartState = {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;

  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;

  clear: () => void;
  clearCart: () => void;

  total: () => number;
};
