export type DashboardAccess = {
  key: string;
  label: string;
  path: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
  dashboards?: DashboardAccess[];
};

export type AuthResponse = {
  message: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user: AuthUser;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  roles: string[];
};

export type AdminRole = {
  id: number;
  name: string;
  description?: string | null;
};

export type AdminModule = {
  id: number;
  name: string;
  code: string;
  description?: string | null;
};

export type PermissionItem = {
  id: number;
  name: string;
  description?: string | null;
  moduleId?: number | null;
  moduleName?: string | null;
  moduleCode?: string | null;
};

export type KnowledgeCategoryRecord = {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  color?: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

export type KnowledgeEventRecord = {
  id: number;
  slug: string;
  title: string;
  summary?: string | null;
  description?: string | null;
  event_date?: string | null;
  location?: string | null;
  is_virtual?: boolean | number | null;
  status?: string | null;
  cover_image_url?: string | null;
  created_at?: string | null;
};

export type KnowledgeCallRecord = {
  id: number;
  slug: string;
  title: string;
  summary?: string | null;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: string | null;
  organization?: string | null;
  created_at?: string | null;
};

export type KnowledgeResourceRecord = {
  id: number;
  slug: string;
  title: string;
  summary?: string | null;
  type?: string | null;
  file_url?: string | null;
  external_url?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export type KnowledgeMediaRecord = {
  id: number;
  title: string;
  type?: string | null;
  url?: string | null;
  thumbnail?: string | null;
  description?: string | null;
  created_at?: string | null;
};

export type KnowledgeArticleRecord = {
  id: number;
  slug: string;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  content?: string | null;
  status?: string | null;
  featured?: boolean | number | null;
  category_id?: number | null;
  category_name?: string | null;
  category_slug?: string | null;
  author_id?: number | null;
  author_name?: string | null;
  cover_image_url?: string | null;
  read_time?: number | null;
  seo_title?: string | null;
  seo_description?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type KnowledgeDashboardSummary = {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  reviewArticles: number;
  totalEvents: number;
  totalCalls: number;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.delete('Authorization');

  const requestHeaders: HeadersInit = headers;
  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: requestHeaders,
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

export async function getCurrentUser() {
  return fetchJson<AuthResponse>('/auth/me', {
    method: 'GET',
  });
}

export async function logoutUser() {
  return fetchJson<{ message: string }>('/auth/logout', {
    method: 'POST',
  });
}

export async function createAdminUser(_token: string | undefined, payload: { name: string; email: string; password: string; roles?: string[] }) {
  return fetchJson<{ message: string; user: AdminUser }>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getAdminUsers(_token?: string) {
  return fetchJson<{ users: AdminUser[] }>('/admin/users', {
    method: 'GET',
  });
}

export async function updateUserStatus(_token: string | undefined, userId: number, isActive: boolean) {
  return fetchJson<{ message: string; user: { userId: number; isActive: boolean } }>(`/admin/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}

export async function updateUserRoles(_token: string | undefined, userId: number, roles: string[]) {
  return fetchJson<{ message: string; user: { userId: number; roles: string[] } }>(`/admin/users/${userId}/roles`, {
    method: 'PATCH',
    body: JSON.stringify({ roles }),
  });
}

export async function getAdminRoles(_token?: string) {
  return fetchJson<{ roles: AdminRole[] }>('/admin/roles', {
    method: 'GET',
  });
}

export async function createAdminRole(_token: string | undefined, name: string) {
  return fetchJson<{ message: string; role: AdminRole }>('/admin/roles', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export async function getAdminModules(_token?: string) {
  return fetchJson<{ modules: AdminModule[] }>('/admin/modules', {
    method: 'GET',
  });
}

export async function getAdminPermissions(_token?: string) {
  return fetchJson<{ permissions: PermissionItem[] }>('/admin/permissions', {
    method: 'GET',
  });
}

export async function createAdminModule(_token: string | undefined, payload: { name: string; code: string; description?: string }) {
  return fetchJson<{ message: string; module: AdminModule }>('/admin/modules', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createAdminPermission(_token: string | undefined, payload: { moduleId: number | string; name: string; description?: string }) {
  return fetchJson<{ message: string; permission: PermissionItem }>('/admin/permissions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getRolePermissions(_token: string | undefined, roleName: string) {
  return fetchJson<{ permissions: string[] }>(`/admin/roles/${encodeURIComponent(roleName)}/permissions`, {
    method: 'GET',
  });
}

export async function updateRolePermissions(_token: string | undefined, roleName: string, permissions: string[]) {
  return fetchJson<{ message: string; role: { roleName: string; permissions: string[] } }>(`/admin/roles/${encodeURIComponent(roleName)}/permissions`, {
    method: 'PATCH',
    body: JSON.stringify({ permissions }),
  });
}

export async function getKnowledgeCategories() {
  const data = await fetchJson<{ categories: KnowledgeCategoryRecord[] }>('/knowledge/categories');
  return data.categories;
}

export async function createKnowledgeCategory(_token: string | undefined, payload: { name: string; description?: string; color?: string; imageUrl?: string }) {
  return fetchJson<{ message: string; category: { id: number; slug: string } }>('/knowledge/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateKnowledgeCategory(_token: string | undefined, categoryId: number, payload: { name?: string; description?: string | null; color?: string | null; imageUrl?: string | null }) {
  return fetchJson<{ message: string; category: { id: number; slug: string; name: string } }>(`/knowledge/admin/categories/${categoryId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteKnowledgeCategory(_token: string | undefined, categoryId: number) {
  return fetchJson<{ message: string }>(`/knowledge/admin/categories/${categoryId}`, {
    method: 'DELETE',
  });
}

export async function getKnowledgeEvents() {
  const data = await fetchJson<{ events: KnowledgeEventRecord[] }>('/knowledge/events');
  return data.events;
}

export async function createKnowledgeEvent(_token: string | undefined, payload: { title: string; summary?: string; description?: string; eventDate?: string | null; location?: string | null; isVirtual?: boolean; status?: string; coverImageUrl?: string | null }) {
  return fetchJson<{ message: string; event: { id: number; slug: string } }>('/knowledge/admin/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateKnowledgeEvent(_token: string | undefined, eventId: number, payload: { title?: string; summary?: string | null; description?: string | null; eventDate?: string | null; location?: string | null; isVirtual?: boolean; status?: string; coverImageUrl?: string | null }) {
  return fetchJson<{ message: string; event: { id: number; slug: string; title: string } }>(`/knowledge/admin/events/${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteKnowledgeEvent(_token: string | undefined, eventId: number) {
  return fetchJson<{ message: string }>(`/knowledge/admin/events/${eventId}`, {
    method: 'DELETE',
  });
}

export async function getKnowledgeCalls() {
  const data = await fetchJson<{ calls: KnowledgeCallRecord[] }>('/knowledge/calls');
  return data.calls;
}

export async function createKnowledgeCall(_token: string | undefined, payload: { title: string; summary?: string; description?: string; startDate?: string | null; endDate?: string | null; status?: string; organization?: string | null }) {
  return fetchJson<{ message: string; call: { id: number; slug: string } }>('/knowledge/admin/calls', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateKnowledgeCall(_token: string | undefined, callId: number, payload: { title?: string; summary?: string | null; description?: string | null; startDate?: string | null; endDate?: string | null; status?: string; organization?: string | null }) {
  return fetchJson<{ message: string; call: { id: number; slug: string; title: string } }>(`/knowledge/admin/calls/${callId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteKnowledgeCall(_token: string | undefined, callId: number) {
  return fetchJson<{ message: string }>(`/knowledge/admin/calls/${callId}`, {
    method: 'DELETE',
  });
}

export async function getKnowledgeResources() {
  const data = await fetchJson<{ resources: KnowledgeResourceRecord[] }>('/knowledge/resources');
  return data.resources;
}

export async function createKnowledgeResource(_token: string | undefined, payload: { title: string; summary?: string; type?: string; fileUrl?: string | null; externalUrl?: string | null; status?: string }) {
  return fetchJson<{ message: string; resource: { id: number; slug: string } }>('/knowledge/admin/resources', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateKnowledgeResource(_token: string | undefined, resourceId: number, payload: { title?: string; summary?: string | null; type?: string; fileUrl?: string | null; externalUrl?: string | null; status?: string }) {
  return fetchJson<{ message: string; resource: { id: number; slug: string; title: string } }>(`/knowledge/admin/resources/${resourceId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteKnowledgeResource(_token: string | undefined, resourceId: number) {
  return fetchJson<{ message: string }>(`/knowledge/admin/resources/${resourceId}`, {
    method: 'DELETE',
  });
}

export async function getKnowledgeMedia() {
  const data = await fetchJson<{ media: KnowledgeMediaRecord[] }>('/knowledge/media');
  return data.media;
}

export async function createKnowledgeMedia(_token: string | undefined, payload: { title: string; type?: string; url?: string | null; thumbnail?: string | null; description?: string | null }) {
  return fetchJson<{ message: string; media: { id: number; title: string } }>('/knowledge/admin/media', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateKnowledgeMedia(_token: string | undefined, mediaId: number, payload: { title?: string; type?: string; url?: string | null; thumbnail?: string | null; description?: string | null }) {
  return fetchJson<{ message: string; media: { id: number; title: string } }>(`/knowledge/admin/media/${mediaId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteKnowledgeMedia(_token: string | undefined, mediaId: number) {
  return fetchJson<{ message: string }>(`/knowledge/admin/media/${mediaId}`, {
    method: 'DELETE',
  });
}

export async function getKnowledgeArticles(params?: { limit?: number; offset?: number; categorySlug?: string }) {
  const query = new URLSearchParams();

  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.offset) query.set('offset', String(params.offset));
  if (params?.categorySlug) query.set('categorySlug', params.categorySlug);

  const suffix = query.toString() ? `?${query.toString()}` : '';
  const data = await fetchJson<{ articles: KnowledgeArticleRecord[] }>(`/knowledge/articles${suffix}`);
  return data.articles;
}

export async function getKnowledgeArticle(slug: string) {
  const data = await fetchJson<{ article: KnowledgeArticleRecord }>(`/knowledge/articles/${encodeURIComponent(slug)}`);
  return data.article;
}

export async function getKnowledgeDashboard(_token?: string) {
  const data = await fetchJson<{ dashboard: KnowledgeDashboardSummary }>('/knowledge/admin/dashboard', {
    method: 'GET',
  });

  return data.dashboard;
}

export async function createKnowledgeArticle(_token: string | undefined, payload: {
  title: string;
  subtitle?: string;
  excerpt?: string;
  content?: string;
  categoryId?: number | null;
  authorName?: string;
  coverImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: string;
  featured?: boolean;
  readTime?: number;
}) {
  return fetchJson<{ message: string; article: { id: number; slug: string } }>('/knowledge/admin/articles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateKnowledgeArticle(_token: string | undefined, articleId: number, payload: {
  title?: string;
  subtitle?: string;
  excerpt?: string;
  content?: string;
  categoryId?: number | null;
  authorName?: string;
  coverImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: string;
  featured?: boolean;
  readTime?: number;
}) {
  return fetchJson<{ message: string; article: { id: number; slug: string; status?: string | null } }>(`/knowledge/admin/articles/${articleId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteKnowledgeArticle(_token: string | undefined, articleId: number) {
  return fetchJson<{ message: string }>(`/knowledge/admin/articles/${articleId}`, {
    method: 'DELETE',
  });
}
