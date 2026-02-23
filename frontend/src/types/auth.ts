export type UserRole = 'BASIC' | 'PREMIUM' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  username: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}
