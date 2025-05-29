import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/proveedores';

export interface Proveedor {
  id: number;
  nombre: string;
  origen: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  constructor(private http: HttpClient) {}

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(API_URL);
  }

  createProveedor(data: Partial<Proveedor>): Observable<Proveedor> {
    return this.http.post<Proveedor>(API_URL, data);
  }

  updateProveedor(id: number, data: Partial<Proveedor>): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${API_URL}/${id}`, data);
  }

  deleteProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${API_URL}/buscar/nombre/${nombre}`);
  }

  buscarPorOrigen(origen: string): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${API_URL}/buscar/origen/${origen}`);
  }

}
