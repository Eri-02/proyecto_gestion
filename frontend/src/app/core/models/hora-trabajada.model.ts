export interface HoraTrabajadaRequest {
  incidenteId: number;
  recursoId: number;
  usuarioRegistraId: number;
  horas: number;
  fechaTrabajo: string;
  descripcion?: string;
  facturable?: boolean;
}

export interface HoraTrabajadaResponse {
  id: number;
  incidenteId: number;
  incidenteTitulo: string;
  recursoId: number;
  recursoNombre: string;
  recursoCargo: string;
  costoPorHora: number;
  usuarioRegistraId: number;
  usuarioRegistraNombre: string;
  horas: number;
  costoTotal: number;
  fechaTrabajo: string;
  descripcion: string;
  facturable: boolean;
  fechaRegistro: string;
}
