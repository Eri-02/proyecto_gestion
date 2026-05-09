export interface CostoExtraRequest {
  incidenteId: number;
  usuarioRegistraId: number;
  concepto: string;
  monto: number;
  fecha: string;
  proveedor?: string;
  documentoSoporte?: string;
  categoria?: string;
  facturable?: boolean;
}

export interface CostoExtraResponse {
  id: number;
  incidenteId: number;
  incidenteTitulo: string;
  usuarioRegistraId: number;
  usuarioRegistraNombre: string;
  concepto: string;
  monto: number;
  fecha: string;
  proveedor: string;
  documentoSoporte: string;
  categoria: string;
  facturable: boolean;
  fechaRegistro: string;
}
