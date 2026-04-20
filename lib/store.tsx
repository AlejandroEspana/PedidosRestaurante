"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import { Ingredient, Product, Order, OrderItem } from './types';

// Mock Data
export const MOCK_INGREDIENTS: Record<string, Ingredient> = {
  'ing-beef': { id: 'ing-beef', name: 'Beef Patty', price: 2.50, category: 'meat' },
  'ing-chicken': { id: 'ing-chicken', name: 'Chicken Breast', price: 2.00, category: 'meat' },
  'ing-bacon': { id: 'ing-bacon', name: 'Crispy Bacon', price: 1.50, category: 'meat' },
  'ing-lettuce': { id: 'ing-lettuce', name: 'Iceberg Lettuce', price: 0.50, category: 'veggie' },
  'ing-tomato': { id: 'ing-tomato', name: 'Sliced Tomato', price: 0.50, category: 'veggie' },
  'ing-onion': { id: 'ing-onion', name: 'Red Onion', price: 0.50, category: 'veggie' },
  'ing-cheddar': { id: 'ing-cheddar', name: 'Cheddar Cheese', price: 1.00, category: 'cheese' },
  'ing-swiss': { id: 'ing-swiss', name: 'Swiss Cheese', price: 1.20, category: 'cheese' },
  'ing-ketchup': { id: 'ing-ketchup', name: 'Ketchup', price: 0.00, category: 'sauce' },
  'ing-mayo': { id: 'ing-mayo', name: 'Mayo', price: 0.00, category: 'sauce' },
  'ing-bbq': { id: 'ing-bbq', name: 'BBQ Sauce', price: 0.50, category: 'sauce' },
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Classic Signature Burger',
    description: 'Our award-winning beef burger with fresh veggies and cheddar cheese.',
    basePrice: 8.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=100',
    category: 'main',
    defaultIngredientIds: ['ing-beef', 'ing-lettuce', 'ing-tomato', 'ing-onion', 'ing-cheddar', 'ing-ketchup', 'ing-mayo'],
    allowedIngredientIds: Object.keys(MOCK_INGREDIENTS),
  },
  {
    id: 'prod-2',
    name: 'BBQ Bacon Artisanal',
    description: 'Crispy bacon, smoky BBQ sauce, and an artisanal brioche bun.',
    basePrice: 10.50,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=100',
    category: 'main',
    defaultIngredientIds: ['ing-beef', 'ing-bacon', 'ing-lettuce', 'ing-cheddar', 'ing-bbq'],
    allowedIngredientIds: Object.keys(MOCK_INGREDIENTS),
  },
  {
    id: 'prod-3',
    name: 'Truffle Parmesan Fries',
    description: 'Crispy french fries tossed in truffle oil, parsley, and fresh parmesan.',
    basePrice: 5.99,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=100', // Fixed fries image
    category: 'side',
    isActive: true,
    defaultIngredientIds: [],
    allowedIngredientIds: ['ing-bacon', 'ing-cheddar'],
  }
];

interface RestaurantState {
  ingredients: typeof MOCK_INGREDIENTS;
  products: Product[];
  orders: Order[];
  currentOrder: Order | null;
}

interface RestaurantContextType extends RestaurantState {
  addProductToOrder: (product: Product, quantity?: number, ingredientQuantities?: Record<string, number>) => void;
  updateOrderItemIngredientQty: (orderItemId: string, ingredientId: string, qty: number) => void;
  removeOrderItem: (orderItemId: string) => void;
  submitOrder: () => void;
  calculateItemPrice: (product: Product, ingredientQuantities: Record<string, number>) => number;
  toggleProductActive: (productId: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [ingredients] = useState(MOCK_INGREDIENTS);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const calculateItemPrice = (product: Product, ingredientQuantities: Record<string, number>): number => {
    let price = product.basePrice;
    for (const [ingId, qty] of Object.entries(ingredientQuantities)) {
      const ing = ingredients[ingId];
      if (!ing) continue;
      const baseQty = product.defaultIngredientIds.includes(ingId) ? 1 : 0;
      if (qty > baseQty) {
        price += (qty - baseQty) * ing.price;
      } else if (qty < baseQty) {
        price -= (baseQty - qty) * (ing.price * 0.5);
      }
    }
    return Math.max(0, price);
  };

  const calculateTotals = (items: OrderItem[]) => {
    const subtotal = items.reduce((acc, item) => acc + (item.calculatedPrice * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const addProductToOrder = (product: Product, quantity: number = 1, providedQuantities?: Record<string, number>) => {
    // If not provided, default initialize to base quantities
    let finalQuantities = providedQuantities;
    if (!finalQuantities) {
      finalQuantities = {};
      product.allowedIngredientIds.forEach(id => {
        finalQuantities![id] = product.defaultIngredientIds.includes(id) ? 1 : 0;
      });
    }

    const calcPrice = calculateItemPrice(product, finalQuantities);
    
    const newItem: OrderItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      product,
      quantity,
      ingredientQuantities: finalQuantities,
      calculatedPrice: calcPrice
    };

    setCurrentOrder(prev => {
      const items = prev ? [...prev.items, newItem] : [newItem];
      const totals = calculateTotals(items);
      return {
        id: prev?.id || `ord-${Date.now()}`,
        tableNumber: prev?.tableNumber || null,
        items,
        ...totals,
        status: 'pending',
        createdAt: prev?.createdAt || new Date().toISOString()
      };
    });
  };

  const updateOrderItemIngredientQty = (orderItemId: string, ingredientId: string, qty: number) => {
    setCurrentOrder(prev => {
      if (!prev) return prev;
      const updatedItems = prev.items.map(item => {
        if (item.id === orderItemId) {
          const newQuantities = { ...item.ingredientQuantities, [ingredientId]: Math.max(0, qty) };
          return {
            ...item,
            ingredientQuantities: newQuantities,
            calculatedPrice: calculateItemPrice(item.product, newQuantities)
          };
        }
        return item;
      });
      const totals = calculateTotals(updatedItems);
      return { ...prev, items: updatedItems, ...totals };
    });
  };

  const removeOrderItem = (orderItemId: string) => {
    setCurrentOrder(prev => {
      if (!prev) return prev;
      const updatedItems = prev.items.filter(i => i.id !== orderItemId);
      const totals = calculateTotals(updatedItems);
      return { ...prev, items: updatedItems, ...totals };
    });
  };

  const submitOrder = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      setOrders(prev => [...prev, { ...currentOrder, status: 'preparing' }]);
      setCurrentOrder(null);
    }
  };

  const toggleProductActive = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, isActive: p.isActive === false ? true : false };
      }
      return p;
    }));
  };

  return (
    <RestaurantContext.Provider value={{
      ingredients,
      products,
      orders,
      currentOrder,
      addProductToOrder,
      updateOrderItemIngredientQty,
      removeOrderItem,
      submitOrder,
      calculateItemPrice,
      toggleProductActive
    }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
