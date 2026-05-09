import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoRequest, EstadoResponse } from '../models/estado.model';

@Injectable({ providedIn: 'root' })
export class EstadoService {
  private readonly API = '/api/estados';

  constructor(private http: HttpClient) {}

  getAll(): Observable<EstadoResponse[]> {
    return this.http.get<EstadoResponse[]>(this.API);
  }

  getById(id: number): Observable<EstadoResponse> {
    return this.http.get<EstadoResponse>(`${this.API}/${id}`);
  }

  create(data: EstadoRequest): Observable<EstadoResponse> {
    return this.http.post<EstadoResponse>(this.API, data);
  }

  update(id: number, data: EstadoRequest): Observable<EstadoResponse> {
    return this.http.put<EstadoResponse>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
