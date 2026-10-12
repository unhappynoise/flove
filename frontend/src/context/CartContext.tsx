"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/lib/strapi";

export type CartItem = {
  product: Product;
  quantity: number;
  size?: string | null;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string | null) => void;
  removeFromCart: (productId: number, size?: string | null) => void;
  updateQuantity: (productId: number, size: string | null, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "flove-cart";

function isLine(item: CartItem, productId: number, size: string | null) {
  return item.product.id === productId && (item.size ?? null) === size;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  function addToCart(product: Product, quantity = 1, size: string | null = null) {
    setItems((prev) => {
      const existing = prev.find((item) => isLine(item, product.id, size));
      if (existing) {
        return prev.map((item) =>
          isLine(item, product.id, size)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, size }];
    });
  }

  function removeFromCart(productId: number, size: string | null = null) {
    setItems((prev) => prev.filter((item) => !isLine(item, productId, size)));
  }

  function updateQuantity(productId: number, size: string | null, quantity: number) {
    if (quantity < 1) {
      removeFromCart(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        isLine(item, productId, size) ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
