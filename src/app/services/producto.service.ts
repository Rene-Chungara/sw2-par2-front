import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/productos';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  stock: number;
  imagen: string;
  tipo: {
    id: number;
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(API_URL);
  }

  createProducto(data: any): Observable<Producto> {
    return this.http.post<Producto>(API_URL, data);
  }

  updateProducto(id: number, data: any): Observable<Producto> {
    return this.http.put<Producto>(`${API_URL}/${id}`, data);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }

  uploadImagen(file: File): Observable<{ ruta: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ ruta: string }>(`${API_URL}/upload`, formData);
  }

  buscarPorNombre(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${API_URL}/buscar/nombre/${nombre}`);
  }

  buscarPorTipo(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${API_URL}/buscar/tipo/${nombre}`);
  }
}
