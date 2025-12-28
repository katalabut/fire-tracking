import { User, Fire, Comment, Session } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || response.statusText);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth
  async login(name: string, role: 'user' | 'firefighter'): Promise<Session> {
    const response = await this.request<Session>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ name, role }),
    });
    this.setToken(response.token);
    return response;
  }

  async me(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/auth/me');
  }

  async logout(): Promise<void> {
    await this.request('/api/auth/logout', { method: 'POST' });
    this.setToken(null);
  }

  // Fires
  async getFires(status?: string): Promise<{ fires: Fire[]; total: number }> {
    const query = status ? `?status=${status}` : '';
    return this.request<{ fires: Fire[]; total: number }>(`/api/fires${query}`);
  }

  async getFire(id: number): Promise<{ fire: Fire }> {
    return this.request<{ fire: Fire }>(`/api/fires/${id}`);
  }

  async createFire(data: {
    latitude: number;
    longitude: number;
    description: string;
  }): Promise<{ fire: Fire }> {
    return this.request<{ fire: Fire }>('/api/fires', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFireStatus(
    id: number,
    status: 'seen' | 'closed'
  ): Promise<{ fire: Fire }> {
    return this.request<{ fire: Fire }>(`/api/fires/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Comments
  async getComments(fireId: number): Promise<{ comments: Comment[] }> {
    return this.request<{ comments: Comment[] }>(`/api/fires/${fireId}/comments`);
  }

  async createComment(fireId: number, text: string): Promise<{ comment: Comment }> {
    return this.request<{ comment: Comment }>(`/api/fires/${fireId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }
}

export const apiClient = new ApiClient();
