import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardResponse, IncidenteCritico } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly API = '/api/dashboard';

  constructor(private http: HttpClient) {}

  getResumen(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.API}/resumen`);
  }

  getCriticos(): Observable<IncidenteCritico[]> {
    return this.http.get<IncidenteCritico[]>(`${this.API}/criticos`);
  }
}
