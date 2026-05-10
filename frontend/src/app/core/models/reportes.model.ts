export interface CostoMensual {
  anio: number;
  mes: number;
  mesNombre: string;
  costoEstimado: number;
  costoReal: number;
  margen: number;
  cantidadIncidentes: number;
}

export interface MttrMensual {
  anio: number;
  mes: number;
  mesNombre: string;
  mttrHoras: number;
  cantidadResueltos: number;
}

export interface IncidentePorCategoria {
  categoria: string;
  cantidad: number;
  porcentaje: number;
}

export interface AnalistaDesempeno {
  analistaId: number;
  nombre: string;
  cargo: string;
  incidentesResueltos: number;
  incidentesAsignados: number;
  tiempoPromedioResolucionHoras: number;
  tasaExito: number;
  horasTrabajadas: number;
}

export interface DetalleTiempoRespuesta {
  incidenteId: number;
  titulo: string;
  fechaCreacion: string;
  fechaPrimerCambioEstado: string;
  tiempoRespuestaMinutos: number;
  tiempoRespuestaHoras: number;
}

export interface TiempoRespuestaResumen {
  promedioGlobalMinutos: number;
  promedioGlobalHoras: number;
  totalIncidentesAnalizados: number;
  detalles: DetalleTiempoRespuesta[];
}

export interface UtilizacionRecurso {
  recursoId: number;
  nombre: string;
  cargo: string;
  especialidad: string;
  horasTrabajadas: number;
  capacidadDisponible: number;
  porcentajeUtilizacion: number;
}
