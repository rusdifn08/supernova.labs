import { PUBLIC_API_URL } from '../env';
import type { ApiErrorResponse, ApiResponse } from './types';

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(message: string, code = 'INTERNAL_ERROR', status = 500, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('snv.session');
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session?.token || null;
  } catch {
    return null;
  }
}

export async function requestApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${PUBLIC_API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const token = getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('snv.session');
        window.dispatchEvent(new CustomEvent('snv:unauthorized'));
      }
      throw new ApiError('Sesi login telah berakhir. Silakan login kembali.', 'UNAUTHORIZED', 401);
    }

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!res.ok) {
      if (isJson) {
        const errorData: ApiErrorResponse = await res.json();
        const errObj = errorData.error || { code: 'BAD_REQUEST', message: 'Permintaan gagal' };
        throw new ApiError(errObj.message || 'Terjadi kesalahan sistem', errObj.code, res.status, errObj.details);
      }
      throw new ApiError(`Permintaan gagal dengan status ${res.status}`, 'HTTP_ERROR', res.status);
    }

    if (res.status === 204) {
      return {} as T;
    }

    if (isJson) {
      const json: ApiResponse<T> = await res.json();
      return json.data !== undefined ? json.data : (json as unknown as T);
    }

    return (await res.text()) as unknown as T;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network / offline error
    throw new ApiError(
      'Gagal terhubung ke server backend Supernova. Pastikan koneksi internet atau server lokal aktif.',
      'NETWORK_ERROR',
      0
    );
  }
}

export const api = {
  get: <T>(path: string, options?: RequestInit) => requestApi<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    requestApi<T>(path, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
    requestApi<T>(path, { ...options, method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, options?: RequestInit) => requestApi<T>(path, { ...options, method: 'DELETE' }),
};
