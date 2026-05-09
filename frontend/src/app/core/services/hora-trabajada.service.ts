import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HoraTrabajadaRequest, HoraTrabajadaResponse } from '../models/hora-trabajada.model';

@Injectable({ providedIn: 'root' })
export class HoraTrabajadaService {
  private readonly API = '/api/horas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<HoraTrabajadaResponse[]> {
    return this.http.get<HoraTrabajadaResponse[]>(this.API);
  }

  getById(id: number): Observable<HoraTrabajadaResponse> {
    return this.http.get<HoraTrabajadaResponse>(`${this.API}/${id}`);
  }

  getByIncidente(incidenteId: number): Observable<HoraTrabajadaResponse[]> {
    return this.http.get<HoraTrabajadaResponse[]>(`${this.API}/incidente/${incidenteId}`);
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
}
