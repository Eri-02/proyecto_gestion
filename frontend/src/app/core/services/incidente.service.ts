import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncidenteRequest, IncidenteResponse } from '../models/incidente.model';

@Injectable({ providedIn: 'root' })
export class IncidenteService {
  private readonly API = '/api/incidentes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<IncidenteResponse[]> {
    return this.http.get<IncidenteResponse[]>(this.API);
  }

  getById(id: number): Observable<IncidenteResponse> {
    return this.http.get<IncidenteResponse>(`${this.API}/${id}`);
  }

  create(data: IncidenteRequest): Observable<IncidenteResponse> {
    return this.http.post<IncidenteResponse>(this.API, data);
  }

  update(id: number, data: IncidenteRequest): Observable<IncidenteResponse> {
    return this.http.put<IncidenteResponse>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  getCriticos(): Observable<IncidenteResponse[]> {
    return this.http.get<IncidenteResponse[]>(`${this.API}/criticos`);
  }
}
