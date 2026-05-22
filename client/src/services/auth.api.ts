import { http } from './http';
import { ApiResponse } from '../types';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await http.post<ApiResponse<AuthResponse>>('/auth/register', {
    name, email, password
  });
  return res.data!;
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await http.post<ApiResponse<AuthResponse>>('/auth/login', {
    email, password
  });
  return res.data!;
}