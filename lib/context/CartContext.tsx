/**
 * Cart Context
 * 
 * Manages shopping cart state with localStorage persistence.
 * Provides cart operations and real-time price calculations with discount support.
 * 
 * Requirements: 3.4, 4.4
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { calculateDiscount, type CartItem as DiscountCartItem } from '@/lib/api/discount-calculator';

export interface CartItem {
  id: string;
  sessionId: string;
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  price: number;
  childId?: string;
  childName?: string;
  childAge?: number;
  familyId?: string;             // For family sessions
  roleId?: string | null;        // Optional role assignment for sessions with character roles
  needsRoleSelection?: boolean;  // True if this session requires role selection
  isAddon?: boolean;             // True if this is an addon purchase
  addonName?: string;            // Addon name for display
  type: 'individual' | 'family' | 'addon';
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  getDiscount: () => number;
  getFinalTotal: () => number;
  getDiscountTier: () => '0' | '300' | '400';
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [items, isInitialized]);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: `${item.sessionId}-${item.childId || item.familyId || 'addon'}-${Date.now()}`,
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId: string, updates: Partial<CartItem>) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemCount = () => items.length;

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  const getDiscount = () => {
    // Convert cart items to discount calculator format
    const discountItems: DiscountCartItem[] = items.map(item => ({
      id: item.id,
      sessionId: item.sessionId,
      childId: item.childId,
      familyId: item.familyId,
      isAddon: item.isAddon,
      price: item.price,
      type: item.type,
    }));
    
    const result = calculateDiscount(discountItems);
    return result.discountAmount;
  };

  const getFinalTotal = () => {
    const discountItems: DiscountCartItem[] = items.map(item => ({
      id: item.id,
      sessionId: item.sessionId,
      childId: item.childId,
      familyId: item.familyId,
      isAddon: item.isAddon,
      price: item.price,
      type: item.type,
    }));
    
    const result = calculateDiscount(discountItems);
    return result.finalTotal;
  };

  const getDiscountTier = (): '0' | '300' | '400' => {
    const discountItems: DiscountCartItem[] = items.map(item => ({
      id: item.id,
      sessionId: item.sessionId,
      childId: item.childId,
      familyId: item.familyId,
      isAddon: item.isAddon,
      price: item.price,
      type: item.type,
    }));
    
    const result = calculateDiscount(discountItems);
    return result.discountTier;
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateItem,
    clearCart,
    getItemCount,
    getTotalPrice,
    getDiscount,
    getFinalTotal,
    getDiscountTier,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
