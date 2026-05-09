export interface RolRequest {
  nombre: string;
  descripcion?: string;
  nivelPermiso: number;
}

export interface RolResponse {
  id: number;
  nombre: string;
  descripcion: string;
  nivelPermiso: number;
  fechaCreacion: string;
}
