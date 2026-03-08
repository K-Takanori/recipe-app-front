import { Ingredient } from '@/types';
import { API_BASE_URL, getRequestOptions } from './authHelper';

export const fetchIngredientsList = async (): Promise<Ingredient[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/ingredients/`, getRequestOptions());
    if (!res.ok) {
      console.warn('Failed to fetch ingredients:', res.status);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error('Error in fetchIngredientsList:', error);
    return [];
  }
};

export const fetchIngredients = fetchIngredientsList;

export const createIngredient = async (name: string, category: string | null = null): Promise<Ingredient> => {
  const res = await fetch(`${API_BASE_URL}/ingredients/`, getRequestOptions('POST', { name, category }));
  if (!res.ok) throw new Error('Failed to create ingredient');
  return await res.json();
};

export const updateIngredient = async (id: number, updates: Partial<Omit<Ingredient, 'id'>>): Promise<Ingredient> => {
  const res = await fetch(`${API_BASE_URL}/ingredients/${id}/`, getRequestOptions('PATCH', updates));
  if (!res.ok) throw new Error('Failed to update ingredient');
  return await res.json();
};

export const deleteIngredient = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/ingredients/${id}/`, getRequestOptions('DELETE'));
  if (!res.ok) throw new Error('Failed to delete ingredient');
};
