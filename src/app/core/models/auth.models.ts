export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface RecoverPasswordRequest {
  email: string;
}

export interface StandardResponse {
  message: string;
  success: boolean;
}
