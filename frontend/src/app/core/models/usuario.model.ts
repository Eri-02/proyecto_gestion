export interface UsuarioRequest {
  username: string;
  password: string;
  email: string;
  nombreCompleto: string;
  rolId: number;
  activo?: boolean;
}

export interface UsuarioResponse {
  id: number;
  username: string;
  email: string;
  nombreCompleto: string;
  rolId: number;
  rolNombre: string;
  rolNivelPermiso: number;
  activo: boolean;
  ultimoAcceso: string;
  fechaCreacion: string;
}
