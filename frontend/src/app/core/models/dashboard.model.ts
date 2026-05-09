export interface DashboardResponse {
  mttrHoras: number;
  desviacionPromedio: number;
  incidentesActivos: number;
  incidentesCriticos: number;
  totalIncidentes: number;
  costoEstimadoTotal: number;
  costoRealTotal: number;
  ingresosTotal: number;
  margenTotal: number;
  listaIncidentesCriticos: IncidenteCritico[];
}

export interface IncidenteCritico {
  id: number;
  titulo: string;
  costoEstimado: number;
  costoReal: number;
  desviacionPorcentual: number;
  ingresos: number;
  margenPorcentual: number;
}
