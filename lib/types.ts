export interface Ingredient {
  id: string;
  name: string;
  price: number;
  category: 'meat' | 'veggie' | 'cheese' | 'sauce' | 'other';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: 'main' | 'side' | 'drink' | 'dessert';
  defaultIngredientIds: string[];
  allowedIngredientIds: string[]; // Ingredients that can be added / modified
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  ingredientQuantities: Record<string, number>;
  calculatedPrice: number;
}

export interface Order {
  id: string;
  tableNumber: string | null;
  items: OrderItem[];
  subtotal: number;
  tax: number; // e.g. 10%
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
}
