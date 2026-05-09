import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CostoExtraRequest, CostoExtraResponse } from '../models/costo-extra.model';

@Injectable({ providedIn: 'root' })
export class CostoExtraService {
  private readonly API = '/api/costos-extras';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CostoExtraResponse[]> {
    return this.http.get<CostoExtraResponse[]>(this.API);
  }

  getById(id: number): Observable<CostoExtraResponse> {
    return this.http.get<CostoExtraResponse>(`${this.API}/${id}`);
  }

  getByIncidente(incidenteId: number): Observable<CostoExtraResponse[]> {
    return this.http.get<CostoExtraResponse[]>(`${this.API}/incidente/${incidenteId}`);
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
}
