import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolRequest, RolResponse } from '../models/rol.model';

@Injectable({ providedIn: 'root' })
export class RolService {
  private readonly API = '/api/roles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RolResponse[]> {
    return this.http.get<RolResponse[]>(this.API);
  }

  getById(id: number): Observable<RolResponse> {
    return this.http.get<RolResponse>(`${this.API}/${id}`);
  }

  create(data: RolRequest): Observable<RolResponse> {
    return this.http.post<RolResponse>(this.API, data);
  }

  update(id: number, data: RolRequest): Observable<RolResponse> {
    return this.http.put<RolResponse>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
