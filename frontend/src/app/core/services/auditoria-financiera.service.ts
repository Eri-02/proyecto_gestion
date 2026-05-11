import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditoriaFinancieraRequest, AuditoriaFinancieraResponse, PageResponse } from '../models/auditoria-financiera.model';

export interface AuditoriaFinancieraFilters {
  inicio?: string;
  fin?: string;
  tipoCambio?: string;
  accion?: string;
  entidadAfectada?: string;
  incidenteId?: number;
  usuarioId?: number;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class AuditoriaFinancieraService {
  private readonly API = '/api/auditoria';

  constructor(private http: HttpClient) {}

  getAll(filters: AuditoriaFinancieraFilters = {}): Observable<PageResponse<AuditoriaFinancieraResponse>> {
    return this.http.get<PageResponse<AuditoriaFinancieraResponse>>(this.API, { params: this.buildParams(filters) });
  }

  getById(id: number): Observable<AuditoriaFinancieraResponse> {
    return this.http.get<AuditoriaFinancieraResponse>(`${this.API}/${id}`);
  }

  create(data: AuditoriaFinancieraRequest): Observable<AuditoriaFinancieraResponse> {
    return this.http.post<AuditoriaFinancieraResponse>(this.API, data);
  }

  update(id: number, data: AuditoriaFinancieraRequest): Observable<AuditoriaFinancieraResponse> {
    return this.http.put<AuditoriaFinancieraResponse>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  private buildParams(filters: AuditoriaFinancieraFilters): HttpParams {
    let params = new HttpParams();
    if (filters.inicio) params = params.set('inicio', filters.inicio);
    if (filters.fin) params = params.set('fin', filters.fin);
    if (filters.tipoCambio) params = params.set('tipoCambio', filters.tipoCambio);
    if (filters.accion) params = params.set('accion', filters.accion);
    if (filters.entidadAfectada) params = params.set('entidadAfectada', filters.entidadAfectada);
    if (filters.incidenteId !== undefined) params = params.set('incidenteId', String(filters.incidenteId));
    if (filters.usuarioId !== undefined) params = params.set('usuarioId', String(filters.usuarioId));
    if (filters.page !== undefined) params = params.set('page', String(filters.page));
    if (filters.size !== undefined) params = params.set('size', String(filters.size));
    return params;
  }
}
