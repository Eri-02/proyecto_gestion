import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CostoMensual,
  MttrMensual,
  IncidentePorCategoria,
  AnalistaDesempeno,
  TiempoRespuestaResumen,
  UtilizacionRecurso
} from '../models/reportes.model';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = '/api/reportes';

  constructor(private http: HttpClient) {}

  obtenerCostosMensuales(inicio?: string, fin?: string): Observable<CostoMensual[]> {
    let params = new HttpParams();
    if (inicio) params = params.set('inicio', inicio);
    if (fin) params = params.set('fin', fin);
    return this.http.get<CostoMensual[]>(`${this.apiUrl}/costos-mensuales`, { params });
  }

  obtenerMttrHistorico(inicio?: string, fin?: string): Observable<MttrMensual[]> {
    let params = new HttpParams();
    if (inicio) params = params.set('inicio', inicio);
    if (fin) params = params.set('fin', fin);
    return this.http.get<MttrMensual[]>(`${this.apiUrl}/mttr-historico`, { params });
  }

  obtenerIncidentesPorCategoria(tipo: string = 'prioridad'): Observable<IncidentePorCategoria[]> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http.get<IncidentePorCategoria[]>(`${this.apiUrl}/incidentes-por-categoria`, { params });
  }

  obtenerDesempenoPorAnalista(inicio?: string, fin?: string): Observable<AnalistaDesempeno[]> {
    let params = new HttpParams();
    if (inicio) params = params.set('inicio', inicio);
    if (fin) params = params.set('fin', fin);
    return this.http.get<AnalistaDesempeno[]>(`${this.apiUrl}/desempeno-analistas`, { params });
  }

  obtenerTiemposRespuesta(): Observable<TiempoRespuestaResumen> {
    return this.http.get<TiempoRespuestaResumen>(`${this.apiUrl}/tiempos-respuesta`);
  }

  obtenerUtilizacionRecursos(inicio?: string, fin?: string, capacidad?: number): Observable<UtilizacionRecurso[]> {
    let params = new HttpParams();
    if (inicio) params = params.set('inicio', inicio);
    if (fin) params = params.set('fin', fin);
    if (capacidad) params = params.set('capacidad', capacidad.toString());
    return this.http.get<UtilizacionRecurso[]>(`${this.apiUrl}/utilizacion-recursos`, { params });
  }
}
