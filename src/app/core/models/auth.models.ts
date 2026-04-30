export interface LoginRequest {
  matricula: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: 'alumni' | 'company' | 'admin';
  user: {
    id: string;
    email: string;
    name?: string;
    role?: 'alumni' | 'company' | 'admin';
  };
}

export interface RecoverPasswordRequest {
  email: string;
}

export interface StandardResponse {
  message: string;
  success: boolean;
}
