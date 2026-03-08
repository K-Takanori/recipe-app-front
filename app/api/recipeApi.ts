import { Recipe } from '@/types';
import { API_BASE_URL, getRequestOptions } from './authHelper';

export const fetchRecipes = async (): Promise<Recipe[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/recipes/`, getRequestOptions());
    if (!res.ok) {
      console.warn('Failed to fetch recipes:', res.status);
      return [];
    }
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.id,
      user: item.user,
      username: item.username,
      name: item.name,
      ingredients: item.ingredients,
      url: item.url,
      instructions: item.instructions,
    }));
  } catch (error) {
    console.error('Error in fetchRecipes:', error);
    return [];
  }
};

export const addRecipe = async (recipe: Omit<Recipe, 'id' | 'user' | 'username'>): Promise<Recipe> => {
  const res = await fetch(`${API_BASE_URL}/recipes/`, getRequestOptions('POST', recipe));

  if (!res.ok) {
    throw new Error('Failed to add recipe');
  }

  return await res.json();
};

export const updateRecipe = async (id: number, recipeData: Partial<Recipe>): Promise<Recipe> => {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}/`, getRequestOptions('PATCH', recipeData));

  if (!res.ok) {
    throw new Error('Failed to update recipe');
  }

  return await res.json();
};

export const deleteRecipe = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}/`, getRequestOptions('DELETE'));

  if (!res.ok) {
    throw new Error('Failed to delete recipe');
  }
};
