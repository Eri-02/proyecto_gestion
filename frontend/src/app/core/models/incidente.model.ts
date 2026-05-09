export interface IncidenteRequest {
  titulo: string;
  descripcion: string;
  prioridadId: number;
  estadoId: number;
  costoEstimado: number;
  ingresos?: number;
  creadoPorUsuarioId: number;
  resueltoPorUsuarioId?: number;
  cliente?: string;
  sistemaAfectado?: string;
  descripcionTecnica?: string;
  leccionesAprendidas?: string;
}

export interface IncidenteResponse {
  id: number;
  titulo: string;
  descripcion: string;
  prioridadId: number;
  prioridadNombre: string;
  prioridadNivel: number;
  prioridadColor: string;
  estadoId: number;
  estadoNombre: string;
  estadoColor: string;
  costoEstimado: number;
  ingresos: number;
  costoReal: number;
  desviacionPorcentual: number;
  costoManoObra: number;
  costoExtras: number;
  margenAbsoluto: number;
  margenPorcentual: number;
  fechaCreacion: string;
  fechaResolucion: string;
  fechaCierre: string;
  creadoPorUsuarioId: number;
  creadoPorNombre: string;
  resueltoPorUsuarioId: number;
  resueltoPorNombre: string;
  cliente: string;
  sistemaAfectado: string;
  descripcionTecnica: string;
  leccionesAprendidas: string;
  horasParaResolucion: number;
  activo: boolean;
  horasTrabajadas: HoraTrabajadaResponse[];
  costosExtras: CostoExtraResponse[];
}

import { HoraTrabajadaResponse } from './hora-trabajada.model';
import { CostoExtraResponse } from './costo-extra.model';
