import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CostoExtraRequest, CostoExtraResponse } from '../models/costo-extra.model';

export interface CostoExtraFilters {
  inicio?: string;
  fin?: string;
  facturable?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CostoExtraService {
  private readonly API = '/api/costos-extras';

  constructor(private http: HttpClient) {}

  getAll(filters: CostoExtraFilters = {}): Observable<CostoExtraResponse[]> {
    return this.http.get<CostoExtraResponse[]>(this.API, { params: this.buildParams(filters) });
  }

  getById(id: number): Observable<CostoExtraResponse> {
    return this.http.get<CostoExtraResponse>(`${this.API}/${id}`);
  }

  getByIncidente(incidenteId: number, filters: CostoExtraFilters = {}): Observable<CostoExtraResponse[]> {
    return this.http.get<CostoExtraResponse[]>(`${this.API}/incidente/${incidenteId}`, { params: this.buildParams(filters) });
  }

  create(data: CostoExtraRequest): Observable<CostoExtraResponse> {
    return this.http.post<CostoExtraResponse>(this.API, data);
  }

  update(id: number, data: CostoExtraRequest): Observable<CostoExtraResponse> {
    return this.http.put<CostoExtraResponse>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  private buildParams(filters: CostoExtraFilters): HttpParams {
    let params = new HttpParams();
    if (filters.inicio) params = params.set('inicio', filters.inicio);
    if (filters.fin) params = params.set('fin', filters.fin);
    if (filters.facturable !== undefined) params = params.set('facturable', String(filters.facturable));
    return params;
  }
}
