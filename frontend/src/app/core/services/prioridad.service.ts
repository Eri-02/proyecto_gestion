import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrioridadRequest, PrioridadResponse } from '../models/prioridad.model';

@Injectable({ providedIn: 'root' })
export class PrioridadService {
  private readonly API = '/api/prioridades';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PrioridadResponse[]> {
    return this.http.get<PrioridadResponse[]>(this.API);
  }

  getById(id: number): Observable<PrioridadResponse> {
    return this.http.get<PrioridadResponse>(`${this.API}/${id}`);
  }

  create(data: PrioridadRequest): Observable<PrioridadResponse> {
    return this.http.post<PrioridadResponse>(this.API, data);
  }

  update(id: number, data: PrioridadRequest): Observable<PrioridadResponse> {
    return this.http.put<PrioridadResponse>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
