import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioRequest, UsuarioResponse } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly API = '/api/usuarios';

  constructor(private http: HttpClient) {}

  getAll(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(this.API);
  }

  getById(id: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.API}/${id}`);
  }

  create(data: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(this.API, data);
  }

  update(id: number, data: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
