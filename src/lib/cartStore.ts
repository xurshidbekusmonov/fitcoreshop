import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image_url: string;
  flavor?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items;
        const existing = currentItems.find((item) => item.id === product.id);

        if (existing) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: product.id,
                title: product.title,
                price: Number(product.price),
                image_url: product.image_url,
                flavor: product.flavor,
                quantity: 1,
              },
            ],
          });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, delta) => {
        set({
          items: get()
            .items.map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[],
        });
      },
      clearCart: () => set({ items: [] }),
      totalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      totalCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: 'fitcore-cart-storage', // Foydalanuvchi sahifani yangilasa ham savatchasi o‘chib ketmaydi
    }
  )
);