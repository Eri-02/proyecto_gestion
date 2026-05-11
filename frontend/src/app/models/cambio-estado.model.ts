export interface CambioEstado {

  id: number;

  estadoAnterior: {
    nombre: string;
  };

  estadoNuevo: {
    nombre: string;
  };

  usuario: {
    nombreCompleto: string;
  };

  comentario: string;

  fechaCambio: string;
}