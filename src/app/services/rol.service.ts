import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rol {
  id: number;
  nombre: string;
}

const API_URL = 'http://localhost:8080/api/roles';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  constructor(private http: HttpClient) {}

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(API_URL);
  }

  createRol(nombre: string): Observable<Rol> {
    return this.http.post<Rol>(API_URL, { nombre });
  }

  deleteRol(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
