export interface FoodItem {
  id: number;
  name: string;
  quantity: number;
  expiryDate: string;
}

export interface ShoppingItem {
  id: number;
  name: string;
  isBought: boolean;
}

export interface Recipe {
  id: number;
  user: number;
  username: string;
  name: string;
  ingredients: string[]; // 必要な食材名のリスト
  url?: string | null;
  instructions?: string | null;
}

export interface Ingredient {
  id: number;
  name: string;
  category: string | null;
}
