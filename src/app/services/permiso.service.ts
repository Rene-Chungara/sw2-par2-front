import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/permisos';

export interface Permiso {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  constructor(private http: HttpClient) {}

  getPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(API_URL);
  }

  createPermiso(nombre: string): Observable<Permiso> {
    return this.http.post<Permiso>(API_URL, { nombre });
  }

  deletePermiso(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
