export interface RecursoRequest {
  nombre: string;
  cargo: string;
  costoPorHora: number;
  especialidad?: string;
  email?: string;
  activo?: boolean;
}

export interface RecursoResponse {
  id: number;
  nombre: string;
  cargo: string;
  costoPorHora: number;
  especialidad: string;
  email: string;
  activo: boolean;
  fechaCreacion: string;
}
