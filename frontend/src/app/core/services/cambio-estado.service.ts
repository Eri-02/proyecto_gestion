import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CambioEstadoRequest, CambioEstadoResponse } from '../models/cambio-estado.model';

@Injectable({ providedIn: 'root' })
export class CambioEstadoService {
  private readonly API = '/api/cambios-estado';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CambioEstadoResponse[]> {
    return this.http.get<CambioEstadoResponse[]>(this.API);
  }

  getByIncidente(incidenteId: number): Observable<CambioEstadoResponse[]> {
    return this.http.get<CambioEstadoResponse[]>(`${this.API}/incidente/${incidenteId}`);
  }

  create(data: CambioEstadoRequest): Observable<CambioEstadoResponse> {
    return this.http.post<CambioEstadoResponse>(this.API, data);
  }
}
