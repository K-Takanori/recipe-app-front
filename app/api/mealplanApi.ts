import { Recipe } from '@/types';
import { API_BASE_URL, getRequestOptions } from './authHelper';

export interface MealPlan {
  id: number;
  date: string;
  recipeId: number | null;
  recipe?: Recipe;
}

export const fetchMealPlans = async (start: string, end: string): Promise<MealPlan[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/meal-plans/?start=${start}&end=${end}`, getRequestOptions());
    if (!res.ok) {
      console.warn('Failed to fetch meal plans:', res.status);
      return [];
    }
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      id: item.id,
      date: item.date,
      recipeId: item.recipe,
      recipe: item.recipe_detail ? {
        id: item.recipe_detail.id,
        user: item.recipe_detail.user || 0,
        username: item.recipe_detail.username || '',
        name: item.recipe_detail.name,
        ingredients: item.recipe_detail.ingredients
      } : undefined
    }));
  } catch (error) {
    console.error('Error in fetchMealPlans:', error);
    return [];
  }
};

export const setMealPlan = async (date: string, recipeId: number | null): Promise<MealPlan> => {
  // First, check if a plan already exists for this date
  const existing = await fetch(`${API_BASE_URL}/meal-plans/?start=${date}&end=${date}`, getRequestOptions());
  const data = await existing.json();
  
  let res;
  if (data.length > 0) {
    // Update existing
    res = await fetch(`${API_BASE_URL}/meal-plans/${data[0].id}/`, getRequestOptions('PATCH', { recipe: recipeId }));
    if (!res.ok) throw new Error('Failed to update meal plan');
  } else {
    // Create new
    res = await fetch(`${API_BASE_URL}/meal-plans/`, getRequestOptions('POST', { date, recipe: recipeId }));
    if (!res.ok) throw new Error('Failed to create meal plan');
  }

  const item = await res.json();
  return {
    id: item.id,
    date: item.date,
    recipeId: item.recipe,
    recipe: item.recipe_detail ? {
      id: item.recipe_detail.id,
      user: item.recipe_detail.user || 0,
      username: item.recipe_detail.username || '',
      name: item.recipe_detail.name,
      ingredients: item.recipe_detail.ingredients
    } : undefined
  };
};

export const deleteMealPlan = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/meal-plans/${id}/`, getRequestOptions('DELETE'));
  if (!res.ok) throw new Error('Failed to delete meal plan');
};
