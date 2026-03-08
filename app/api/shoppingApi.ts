import { ShoppingItem } from '@/types';
import { API_BASE_URL, getRequestOptions } from './authHelper';

export const fetchShoppingItems = async (): Promise<ShoppingItem[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/shopping-items/`, getRequestOptions());
    if (!res.ok) {
      console.warn('Failed to fetch shopping items:', res.status);
      return [];
    }
    const data = await res.json();
    const items = data.results || data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.map((item: any) => ({
      id: item.id,
      name: item.name,
      isBought: item.is_bought,
    }));
  } catch (error) {
    console.error('Error in fetchShoppingItems:', error);
    return [];
  }
};

export const addShoppingItem = async (name: string): Promise<ShoppingItem> => {
  const res = await fetch(`${API_BASE_URL}/shopping-items/`, getRequestOptions('POST', { name }));

  if (!res.ok) {
    throw new Error('Failed to add shopping item');
  }

  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    isBought: data.is_bought,
  };
};

export const updateShoppingItem = async (id: number, isBought: boolean): Promise<ShoppingItem> => {
  const res = await fetch(`${API_BASE_URL}/shopping-items/${id}/`, getRequestOptions('PATCH', { is_bought: isBought }));

  if (!res.ok) {
    throw new Error('Failed to update shopping item');
  }

  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    isBought: data.is_bought,
  };
};

export const deleteShoppingItem = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/shopping-items/${id}/`, getRequestOptions('DELETE'));

  if (!res.ok) {
    throw new Error('Failed to delete shopping item');
  }
};
