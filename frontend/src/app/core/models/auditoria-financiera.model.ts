export interface AuditoriaFinancieraRequest {
  incidenteId: number;
  usuarioId: number;
  tipoCambio: string;
  accion: string;
  entidadAfectada: string;
  registroId: number;
  detalle?: string;
  valorAfectado?: number;
  registroAnterior?: string;
  registroNuevo?: string;
}

export interface AuditoriaFinancieraResponse {
  id: number;
  incidenteId: number;
  incidenteTitulo: string;
  usuarioId: number;
  usuarioNombre: string;
  tipoCambio: string;
  accion: string;
  entidadAfectada: string;
  registroId: number;
  detalle: string | null;
  valorAfectado: number | null;
  registroAnterior: string | null;
  registroNuevo: string | null;
  ipAddress: string | null;
  fechaCambio: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
