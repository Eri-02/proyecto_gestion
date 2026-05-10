import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PresupuestoRequest, PresupuestoResponse } from '../models/presupuesto.model';

@Injectable({ providedIn: 'root' })
export class PresupuestoService {
  private readonly API = '/api/presupuestos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PresupuestoResponse[]> {
    return this.http.get<PresupuestoResponse[]>(this.API);
  }

  getById(id: number): Observable<PresupuestoResponse> {
    return this.http.get<PresupuestoResponse>(`${this.API}/${id}`);
  }

  create(data: PresupuestoRequest): Observable<PresupuestoResponse> {
    return this.http.post<PresupuestoResponse>(this.API, data);
  }

  update(id: number, data: PresupuestoRequest): Observable<PresupuestoResponse> {
    return this.http.put<PresupuestoResponse>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
