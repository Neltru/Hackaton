export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string | number;
  user: {
    id: string | number;
    email: string;
    name?: string;
    role?: string | number;
  };
}

export interface RecoverPasswordRequest {
  email: string;
}

export interface Verify2faRequest {
  email: string;
  code: string;
}

export interface RegisterEgresadoRequest {
  matricula: string;
  nombre: string;
  email: string;
  password: string;
  carrera: string;
}

export interface RegisterEmpresaRequest {
  nombre_empresa: string;
  email: string;
  password: string;
  sector: string;
  contacto: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
}

export interface StandardResponse {
  message: string;
  success: boolean;
}
