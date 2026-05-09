import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecursoRequest, RecursoResponse } from '../models/recurso.model';

@Injectable({ providedIn: 'root' })
export class RecursoService {
  private readonly API = '/api/recursos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RecursoResponse[]> {
    return this.http.get<RecursoResponse[]>(this.API);
  }

  getById(id: number): Observable<RecursoResponse> {
    return this.http.get<RecursoResponse>(`${this.API}/${id}`);
  }

  create(data: RecursoRequest): Observable<RecursoResponse> {
    return this.http.post<RecursoResponse>(this.API, data);
  }

  update(id: number, data: RecursoRequest): Observable<RecursoResponse> {
    return this.http.put<RecursoResponse>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
