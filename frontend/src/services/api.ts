/**
 * FISH API Service Layer (TypeScript)
 *
 * Single source of truth for frontend <-> backend calls.
 * - Default export: apiService (backwards compatible with older imports)
 * - Named exports: apiService, apiRequest, APIError, apiUtils, etc.
 */

const API_BASE_URL = '/api';

export class APIError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

function hasJsonContentType(contentType: string | null): boolean {
  return !!contentType && contentType.includes('application/json');
}

/**
 * Base API request function with session cookie support and error handling.
 */
export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  const mergedOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...(defaultOptions.headers as Record<string, string>),
      ...(options.headers as Record<string, string> | undefined),
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    const contentType = response.headers.get('content-type');

    let data: unknown;
    if (hasJsonContentType(contentType)) {
      data = (await response.json()) as JsonValue;
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const message =
        typeof data === 'object' && data && 'message' in data
          ? String((data as any).message)
          : typeof data === 'object' && data && 'error' in data
            ? String((data as any).error)
            : `HTTP error! status: ${response.status}`;

      throw new APIError(message, response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : String(error);
    throw new APIError('Network error: Unable to connect to server', 0, { originalError: message });
  }
}

/** Authentication API endpoints */
export const authAPI = {
  login(email: string, password: string) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register(email: string, password: string, first_name: string, last_name: string) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, first_name, last_name }),
    });
  },

  logout() {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  getStatus() {
    return apiRequest('/auth/status');
  },
};

/** User profile + preferences */
export const userAPI = {
  getProfile() {
    return apiRequest('/user/profile');
  },

  updatePreferences(preferences: Record<string, unknown>) {
    return apiRequest('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  },
};

/** Study sessions */
export const studyAPI = {
  startSession(sessionData: Record<string, unknown>) {
    return apiRequest('/study/session/start', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  completeSession(sessionId: number | string, completionData: Record<string, unknown>) {
    return apiRequest(`/study/session/${sessionId}/complete`, {
      method: 'PUT',
      body: JSON.stringify(completionData),
    });
  },

  getSessions(params: Record<string, string | number> = {}) {
    const queryString = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
    return apiRequest(`/study/sessions${queryString ? `?${queryString}` : ''}`);
  },
};

/** Tasks */
export const taskAPI = {
  getTasks(filters: Record<string, string | number> = {}) {
    const queryString = new URLSearchParams(Object.entries(filters).map(([k, v]) => [k, String(v)])).toString();
    return apiRequest(`/tasks${queryString ? `?${queryString}` : ''}`);
  },

  createTask(taskData: Record<string, unknown>) {
    return apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  updateTask(taskId: number | string, updates: Record<string, unknown>) {
    return apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteTask(taskId: number | string) {
    return apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
};

/** Notes */
export const notesAPI = {
  getNotes(filters: Record<string, string | number> = {}) {
    const queryString = new URLSearchParams(Object.entries(filters).map(([k, v]) => [k, String(v)])).toString();
    return apiRequest(`/notes${queryString ? `?${queryString}` : ''}`);
  },

  createNote(noteData: Record<string, unknown>) {
    return apiRequest('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  },

  updateNote(noteId: number | string, updates: Record<string, unknown>) {
    return apiRequest(`/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteNote(noteId: number | string) {
    return apiRequest(`/notes/${noteId}`, {
      method: 'DELETE',
    });
  },
};

/** Study circles */
export const circlesAPI = {
  getCircles() {
    return apiRequest('/circles');
  },

  joinCircle(circleId: number | string) {
    return apiRequest(`/circles/${circleId}/join`, {
      method: 'POST',
    });
  },

  leaveCircle(circleId: number | string) {
    return apiRequest(`/circles/${circleId}/leave`, {
      method: 'POST',
    });
  },

  createCircle(circleData: Record<string, unknown>) {
    return apiRequest('/circles', {
      method: 'POST',
      body: JSON.stringify(circleData),
    });
  },
};

/** AI tutoring persistence endpoints */
export const aiAPI = {
  createConversation(conversationData: Record<string, unknown>) {
    return apiRequest('/ai/conversation', {
      method: 'POST',
      body: JSON.stringify(conversationData),
    });
  },

  saveMessage(messageData: Record<string, unknown>) {
    return apiRequest('/ai/message', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  getConversation(conversationId: number | string) {
    return apiRequest(`/ai/conversation/${conversationId}`);
  },
};

/** Analytics */
export const analyticsAPI = {
  getDashboardStats() {
    return apiRequest('/analytics/dashboard');
  },

  getActivity(limit = 20) {
    return apiRequest(`/analytics/activity?limit=${limit}`);
  },

  getPerformanceReport(dateRange: unknown) {
    return apiRequest('/analytics/performance', {
      method: 'POST',
      body: JSON.stringify({ dateRange }),
    });
  },
};

export const healthAPI = {
  checkHealth() {
    return apiRequest('/health');
  },
};

export const apiUtils = {
  isAuthError(error: unknown): boolean {
    return error instanceof APIError && error.status === 401;
  },

  isServerError(error: unknown): boolean {
    return error instanceof APIError && error.status >= 500;
  },

  formatErrorMessage(error: unknown): string {
    if (error instanceof APIError) return error.message;
    return 'An unexpected error occurred. Please try again.';
  },

  async retryRequest<T>(requestFn: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError: unknown;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        if (this.isAuthError(error)) throw error;
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }
    throw lastError;
  },
};

export const apiService = {
  auth: authAPI,
  user: userAPI,
  study: {
    ...studyAPI,
    getStats: () => apiRequest('/study/stats'),
    endSession: (sessionId: number | string) => studyAPI.completeSession(sessionId, { completed_at: new Date().toISOString() }),
  },
  tasks: {
    ...taskAPI,
    getAll: async (filters?: Record<string, string | number>) => {
      const result = await taskAPI.getTasks(filters);
      const asAny = result as any;
      return asAny?.tasks || asAny || [];
    },
    create: async (data: Record<string, unknown>) => {
      const result = await taskAPI.createTask(data);
      const asAny = result as any;
      return asAny?.task || asAny;
    },
    update: (id: number | string, data: Record<string, unknown>) => taskAPI.updateTask(id, data),
    delete: (id: number | string) => taskAPI.deleteTask(id),
  },
  notes: {
    ...notesAPI,
    getAll: async (filters?: Record<string, string | number>) => {
      const result = await notesAPI.getNotes(filters);
      const asAny = result as any;
      return asAny?.notes || asAny || [];
    },
    create: async (data: Record<string, unknown>) => {
      const result = await notesAPI.createNote(data);
      const asAny = result as any;
      return asAny?.note || asAny;
    },
    update: (id: number | string, data: Record<string, unknown>) => notesAPI.updateNote(id, data),
    delete: (id: number | string) => notesAPI.deleteNote(id),
  },
  circles: circlesAPI,
  ai: aiAPI,
  analytics: analyticsAPI,
  health: healthAPI,
  utils: apiUtils,
};

export default apiService;
