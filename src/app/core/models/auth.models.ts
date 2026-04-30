export interface LoginRequest {
  nombre_usuario: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  require_2fa?: boolean;
  message?: string;
  user?: {
    id: string | number;
    rol_id: string | number;
    nombre_usuario: string;
    name?: string;
  };
}

export interface RecoverPasswordRequest {
  nombre_usuario: string;
}

export interface Verify2faRequest {
  nombre_usuario: string;
  codigo: string;
}

export interface RegisterEgresadoRequest {
  matricula: string;
  nombre: string;
  email: string;
  password: string;
  carrera: string;
}

export interface RegisterEmpresaRequest {
  nombre: string;
  correo: string;
  rfc: string;
  password: string;
  estado: string;
  municipio: string;
}

export interface ResetPasswordRequest {
  nombre_usuario: string;
  token: string;
  new_password: string;
}

export interface StandardResponse {
  message: string;
  success: boolean;
}
