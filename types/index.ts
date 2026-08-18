// ============================================
// CORE TYPES
// ============================================

export type TaskStatus = 'todo' | 'doing' | 'completed' | 'on_hold';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low' | 'no_priority';

export interface TaskUpdate {
  _id: string;
  userId: string; // The user who made the update (using simple string for now, could be User object)
  text: string;
  createdAt: string;
}

export interface Subtask {
  _id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignee?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  labels: string[];
  assignee?: string;
  reporter?: string; // New
  teams?: string[]; // New
  subtasks?: Subtask[]; // New
  updates?: TaskUpdate[]; // New (Comments/Activity log)
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  priority: string;
  lead?: string;
  dueDate?: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email?: string;
  isGuest: boolean;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

// ============================================
// FORM TYPES
// ============================================

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  labels?: string[];
  assignee?: string;
  reporter?: string;
  teams?: string[];
  subtasks?: Subtask[];
  updates?: TaskUpdate[];
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  priority?: string;
  lead?: string;
  dueDate?: string;
  status?: string;
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {}

// ============================================
// UI TYPES
// ============================================

export type ViewMode = 'board' | 'list';

export type AccentColor = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';
export type ThemeMode = 'light' | 'dark';

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  doing: 'Doing',
  completed: 'Completed',
  on_hold: 'On Hold',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  no_priority: 'No Priority',
};

export const ACCENT_COLORS: AccentColor[] = ['amber', 'blue', 'pink', 'rose', 'emerald', 'black'];

export const ACCENT_HEX: Record<AccentColor, string> = {
  amber: '#f59e0b',
  blue: '#3b82f6',
  pink: '#ec4899',
  rose: '#f43f5e',
  emerald: '#10b981',
  black: '#18181b',
};

export const LABEL_OPTIONS = [
  'Research',
  'Design',
  'Development',
  'Testing',
  'Deployment',
  'Review',
  'Security',
  'Audit',
];
