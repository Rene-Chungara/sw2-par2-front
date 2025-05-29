import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/tipos';

export interface Tipo {
  id: number;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipoService {
  constructor(private http: HttpClient) {}

  getTipos(): Observable<Tipo[]> {
    return this.http.get<Tipo[]>(API_URL);
  }

  createTipo(data: Partial<Tipo>): Observable<Tipo> {
    return this.http.post<Tipo>(API_URL, data);
  }

  updateTipo(id: number, data: Partial<Tipo>): Observable<Tipo> {
    return this.http.put<Tipo>(`${API_URL}/${id}`, data);
  }
  
  deleteTipo(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
