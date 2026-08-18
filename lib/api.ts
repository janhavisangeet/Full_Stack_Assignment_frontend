import {
  AuthResponse,
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// ============================================
// HTTP HELPER
// ============================================

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('pyramid-token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      errorMessage = err.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

// ============================================
// AUTH API
// ============================================

export const authApi = {
  guestLogin: async (name?: string): Promise<AuthResponse> => {
    return request('/auth/guest', {
      method: 'POST',
      body: JSON.stringify({ name: name || undefined }),
    });
  },

  getMe: async (): Promise<{ _id: string; name: string; isGuest: boolean; email?: string; title?: string; username?: string }> => {
    return request('/auth/me');
  },

  updateProfile: async (payload: { name?: string; email?: string; title?: string; username?: string }): Promise<{ _id: string; name: string; isGuest: boolean; email?: string; title?: string; username?: string }> => {
    return request('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};

// ============================================
// TASKS API
// ============================================

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    return request('/tasks');
  },

  getOne: async (id: string): Promise<Task> => {
    return request(`/tasks/${id}`);
  },

  create: async (payload: CreateTaskPayload): Promise<Task> => {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
    return request(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return request(`/tasks/${id}`, { method: 'DELETE' });
  },
};

// ============================================
// PROJECTS API
// ============================================

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    return request('/projects');
  },

  create: async (payload: CreateProjectPayload): Promise<Project> => {
    return request('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateProjectPayload): Promise<Project> => {
    return request(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return request(`/projects/${id}`, { method: 'DELETE' });
  },
};
