import { axiosInstance } from './axios-instance';
import type { UserRole } from '../types/auth';

export interface AdminUserResponse {
  id: number;
  email: string;
  username: string;
  role: UserRole;
}

export async function fetchAllUsers(): Promise<AdminUserResponse[]> {
  const { data } = await axiosInstance.get<AdminUserResponse[]>('/admin/users');
  return data;
}

export async function updateUserRole(userId: number, role: UserRole): Promise<AdminUserResponse> {
  const { data } = await axiosInstance.put<AdminUserResponse>(`/admin/users/${userId}/role`, { role });
  return data;
}
