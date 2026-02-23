/**
 * Auth API functions — login, register, and current user fetch.
 * Uses the shared axiosInstance (with JWT interceptors).
 */
import { axiosInstance } from './axios-instance';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

export async function loginApi(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function registerApi(payload: RegisterRequest): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await axiosInstance.get<User>('/auth/me');
  return data;
}
