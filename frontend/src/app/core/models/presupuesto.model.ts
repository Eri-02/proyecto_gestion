export type PresupuestoEstado = 'VIGENTE' | 'ALERTA' | 'EXCEDIDO' | 'CERRADO';

export interface PresupuestoRequest {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  montoPresupuestado: number;
  umbralAlertaPorcentaje: number;
  creadoPorUsuarioId?: number;
  descripcion?: string;
}

export interface PresupuestoResponse {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  montoPresupuestado: number;
  umbralAlertaPorcentaje: number;
  creadoPorUsuarioId: number | null;
  creadoPorUsuarioNombre: string | null;
  descripcion: string | null;
  activo: boolean;
  fechaCreacion: string;
  montoConsumido: number;
  montoDisponible: number;
  porcentajeConsumo: number;
  desviacionAbsoluta: number;
  desviacionPorcentual: number;
  excedeUmbral: boolean;
  estado: PresupuestoEstado;
  alertaMensaje: string | null;
}
