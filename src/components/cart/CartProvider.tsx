"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Product, mapListItemToProduct } from "@/lib/products";
import { useAuth } from "@/lib/AuthProvider";
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
} from "@/lib/api";

export interface CartItem {
  product: Product;
  quantity: number;
  /** Backend cart-item id (for update/remove API calls) */
  backendId?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);

  // ── Fetch cart from backend when user logs in ───────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      hasFetched.current = false;
      return;
    }
    if (hasFetched.current) return;

    let cancelled = false;
    const loadCart = async () => {
      setLoading(true);
      try {
        const data = await fetchCart();
        if (cancelled) return;
        const mapped: CartItem[] = data.items
          .filter((ci) => ci.product !== null)
          .map((ci) => ({
            product: mapListItemToProduct(ci.product!),
            quantity: ci.quantity,
            backendId: ci.id,
          }));
        setItems(mapped);
        hasFetched.current = true;
      } catch {
        // silently fail — cart will appear empty
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadCart();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // ── Add item (syncs with backend) ───────────────────────────────────────
  const addItem = useCallback(
    async (product: Product) => {
      // Optimistic UI update
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...prev, { product, quantity: 1 }];
      });
      setIsOpen(true);

      // Sync with backend
      if (isAuthenticated) {
        try {
          const existing = items.find((i) => i.product.id === product.id);
          if (existing?.backendId) {
            // Update quantity on backend
            await apiUpdateCartItem(existing.backendId, existing.quantity + 1);
          } else {
            // Add new item to backend cart
            const resp = await apiAddToCart(product.id, 1);
            // Store the backend cart item id
            setItems((prev) =>
              prev.map((i) =>
                i.product.id === product.id
                  ? { ...i, backendId: resp.id }
                  : i
              )
            );
          }
        } catch {
          // If backend fails, still keep the optimistic UI
        }
      }
    },
    [isAuthenticated, items]
  );

  // ── Remove item ─────────────────────────────────────────────────────────
  const removeItem = useCallback(
    async (productId: string) => {
      const item = items.find((i) => i.product.id === productId);
      setItems((prev) => prev.filter((i) => i.product.id !== productId));

      if (isAuthenticated && item?.backendId) {
        try {
          await apiRemoveCartItem(item.backendId);
        } catch {
          // silently fail
        }
      }
    },
    [isAuthenticated, items]
  );

  // ── Update quantity ─────────────────────────────────────────────────────
  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }

      const item = items.find((i) => i.product.id === productId);
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        )
      );

      if (isAuthenticated && item?.backendId) {
        try {
          await apiUpdateCartItem(item.backendId, quantity);
        } catch {
          // silently fail
        }
      }
    },
    [removeItem, isAuthenticated, items]
  );

  // ── Clear cart ──────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    setItems([]);
    if (isAuthenticated) {
      try {
        await apiClearCart();
      } catch {
        // silently fail
      }
    }
  }, [isAuthenticated]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
