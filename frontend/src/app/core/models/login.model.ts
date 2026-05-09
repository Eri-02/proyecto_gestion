export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  username: string;
  nombreCompleto: string;
  email: string;
  rol: string;
  nivelPermiso: number;
}
