"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, sizeId?: number) => void;
  removeFromCart: (productId: number, sizeId?: number) => void;
  updateQuantity: (productId: number, quantity: number, sizeId?: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, mounted]);

  const addToCart = useCallback((product: Product, quantity = 1, sizeId?: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product.id === product.id && item.sizeId === sizeId
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id && item.sizeId === sizeId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { product, quantity, sizeId }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: number, sizeId?: number) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.product.id === productId && item.sizeId === sizeId))
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: number, quantity: number, sizeId?: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, sizeId);
        return;
      }
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId && item.sizeId === sizeId
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.product.salePrice || item.product.basePrice;
      return total + parseFloat(price) * item.quantity;
    }, 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const value = useMemo<CartContextType>(
    () => ({
      cartItems: mounted ? cartItems : [],
      addToCart: mounted ? addToCart : () => {},
      removeFromCart: mounted ? removeFromCart : () => {},
      updateQuantity: mounted ? updateQuantity : () => {},
      clearCart: mounted ? clearCart : () => {},
      getCartTotal: mounted ? getCartTotal : () => 0,
      getCartCount: mounted ? getCartCount : () => 0,
      isOpen,
      setIsOpen,
    }),
    [
      mounted,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isOpen,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
