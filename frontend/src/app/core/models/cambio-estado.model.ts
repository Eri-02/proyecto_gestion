export interface CambioEstadoRequest {
  incidenteId: number;
  estadoAnteriorId: number;
  estadoNuevoId: number;
  usuarioId: number;
  comentario?: string;
}

export interface CambioEstadoResponse {
  id: number;
  incidenteId: number;
  incidenteTitulo: string;
  estadoAnteriorId: number;
  estadoAnteriorNombre: string;
  estadoNuevoId: number;
  estadoNuevoNombre: string;
  usuarioId: number;
  usuarioNombre: string;
  comentario: string;
  fechaCambio: string;
}
