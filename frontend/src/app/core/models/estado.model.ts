export interface EstadoRequest {
  nombre: string;
  descripcion?: string;
  color?: string;
}

export interface EstadoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
}
