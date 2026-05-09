export interface PrioridadRequest {
  nombre: string;
  nivel: number;
  color?: string;
  tiempoResolucionEsperadoHoras?: number;
}

export interface PrioridadResponse {
  id: number;
  nombre: string;
  nivel: number;
  color: string;
  tiempoResolucionEsperadoHoras: number;
}
