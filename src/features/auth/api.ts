import { api } from '../../lib/api/client';
import type { Session, Tenant, User } from '../../lib/api/types';

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  business_name: string;
  business_type: string;
  phone: string;
  city?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) => api.post<Session>('/auth/register', payload),
  login: (payload: LoginPayload) => api.post<Session>('/auth/login', payload),
  demo: () => api.post<Session>('/auth/demo'),
  me: () => api.get<{ user: User; tenant: Tenant }>('/auth/me'),
};
