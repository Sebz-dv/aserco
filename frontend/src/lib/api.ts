export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  message: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user: AuthUser;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data?.message === 'string' ? data.message : 'Error al procesar la solicitud.';
    throw new Error(message);
  }

  return data as T;
}

export async function registerUser(payload: { name: string; email: string; password: string }) {
  return fetchJson<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: { email: string; password: string }) {
  return fetchJson<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser(token: string) {
  return fetchJson<AuthResponse>('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
