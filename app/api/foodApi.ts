import { FoodItem } from '@/types';
import { API_BASE_URL, getRequestOptions } from './authHelper';

export const fetchFoods = async (): Promise<FoodItem[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/foods/`, getRequestOptions());
    
    if (!res.ok) {
      console.warn('Failed to fetch foods:', res.status);
      return [];
    }
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      expiryDate: item.expiry_date,
    }));
  } catch (error) {
    console.error('Error in fetchFoods:', error);
    return [];
  }
};

export const addFood = async (item: Omit<FoodItem, 'id'>): Promise<FoodItem> => {
  const res = await fetch(`${API_BASE_URL}/foods/`, getRequestOptions('POST', {
    name: item.name,
    quantity: item.quantity,
    expiry_date: item.expiryDate,
  }));

  if (!res.ok) {
    throw new Error('Failed to add food');
  }

  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    quantity: data.quantity,
    expiryDate: data.expiry_date,
  };
};

export const updateFood = async (id: number, updates: Partial<Omit<FoodItem, 'id'>>): Promise<FoodItem> => {
  const payload: any = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.quantity !== undefined) payload.quantity = updates.quantity;
  if (updates.expiryDate !== undefined) payload.expiry_date = updates.expiryDate;

  const res = await fetch(`${API_BASE_URL}/foods/${id}/`, getRequestOptions('PATCH', payload));

  if (!res.ok) {
    throw new Error('Failed to update food');
  }

  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    quantity: data.quantity,
    expiryDate: data.expiry_date,
  };
};

export const deleteFood = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/foods/${id}/`, getRequestOptions('DELETE'));

  if (!res.ok) {
    throw new Error('Failed to delete food');
  }
};
