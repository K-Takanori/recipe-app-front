import { API_BASE_URL, getRequestOptions } from './authHelper';

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/users/`, getRequestOptions());
    if (!res.ok) {
      console.warn('Failed to fetch users:', res.status);
      return [];
    }
    const data = await res.json();
    return data.results || data;
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    return [];
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/auth/users/${id}/`, getRequestOptions('DELETE'));
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete user');
  }
};
