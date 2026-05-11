import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HoraTrabajadaRequest, HoraTrabajadaResponse } from '../models/hora-trabajada.model';

export interface HoraTrabajadaFilters {
  inicio?: string;
  fin?: string;
  facturable?: boolean;
}

@Injectable({ providedIn: 'root' })
export class HoraTrabajadaService {
  private readonly API = '/api/horas';

  constructor(private http: HttpClient) {}

  getAll(filters: HoraTrabajadaFilters = {}): Observable<HoraTrabajadaResponse[]> {
    return this.http.get<HoraTrabajadaResponse[]>(this.API, { params: this.buildParams(filters) });
  }

  getById(id: number): Observable<HoraTrabajadaResponse> {
    return this.http.get<HoraTrabajadaResponse>(`${this.API}/${id}`);
  }

  getByIncidente(incidenteId: number, filters: HoraTrabajadaFilters = {}): Observable<HoraTrabajadaResponse[]> {
    return this.http.get<HoraTrabajadaResponse[]>(`${this.API}/incidente/${incidenteId}`, { params: this.buildParams(filters) });
  }

  create(data: HoraTrabajadaRequest): Observable<HoraTrabajadaResponse> {
    return this.http.post<HoraTrabajadaResponse>(this.API, data);
  }

  update(id: number, data: HoraTrabajadaRequest): Observable<HoraTrabajadaResponse> {
    return this.http.put<HoraTrabajadaResponse>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  private buildParams(filters: HoraTrabajadaFilters): HttpParams {
    let params = new HttpParams();
    if (filters.inicio) params = params.set('inicio', filters.inicio);
    if (filters.fin) params = params.set('fin', filters.fin);
    if (filters.facturable !== undefined) params = params.set('facturable', String(filters.facturable));
    return params;
  }
}
