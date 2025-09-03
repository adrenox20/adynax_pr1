import api from './api';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  }

  async getCurrentUser(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await api.get('/api/auth/me');
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

const authService = new AuthService();
export default authService;
