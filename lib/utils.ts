import { TaskStatus, TaskPriority } from '@/types';

// ============================================
// DATE UTILS
// ============================================

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export function toInputDate(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
}

// ============================================
// PRIORITY UTILS
// ============================================

export const priorityColors: Record<TaskPriority, { text: string; bg: string; dot: string }> = {
  urgent: { text: 'text-red-600', bg: 'bg-red-50', dot: '#ef4444' },
  high: { text: 'text-orange-600', bg: 'bg-orange-50', dot: '#f97316' },
  medium: { text: 'text-yellow-600', bg: 'bg-yellow-50', dot: '#eab308' },
  low: { text: 'text-gray-500', bg: 'bg-gray-50', dot: '#9ca3af' },
  no_priority: { text: 'text-gray-400', bg: 'bg-gray-50', dot: '#d1d5db' },
};

export const statusColors: Record<TaskStatus, { text: string; bg: string }> = {
  todo: { text: 'text-blue-600', bg: 'bg-blue-50' },
  doing: { text: 'text-amber-600', bg: 'bg-amber-50' },
  completed: { text: 'text-emerald-600', bg: 'bg-emerald-50' },
  on_hold: { text: 'text-gray-500', bg: 'bg-gray-50' },
};

// ============================================
// AUTH UTILS
// ============================================

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('pyramid-token');
}

export function getStoredUser(): { _id: string; name: string; isGuest: boolean } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('pyramid-user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUser(user: { _id: string; name: string; isGuest: boolean; email?: string; title?: string; username?: string }) {
  localStorage.setItem('pyramid-user', JSON.stringify(user));
}

export function saveAuth(token: string, user: { _id: string; name: string; isGuest: boolean; email?: string; title?: string; username?: string }) {
  localStorage.setItem('pyramid-token', token);
  saveUser(user);
}

export function clearAuth() {
  localStorage.removeItem('pyramid-token');
  localStorage.removeItem('pyramid-user');
}

// ============================================
// MISC
// ============================================

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
