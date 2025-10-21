import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getItems(Module: string, Accion: string = ''): Observable<any[]> {
    let AccionValor = Accion != '' ? `/${Accion}`:'';
    return this.http.get<any[]>(`${this.apiUrl}/${Module}${this.accionValor(Accion)}`);
  }

  getItem(Module: string, id: number, Accion: string = ''): Observable<any> {
    let AccionValor = Accion != '' ? `/${Accion}`: '';
    return this.http.get<any>(`${this.apiUrl}/${Module}${this.accionValor(Accion)}/${id}`);
  }

  postItem(Module: string, data: any, Accion: string = ''): Observable<any> {
    let AccionValor = Accion != '' ? `/${Accion}` :'';
    return this.http.post<any>(`${this.apiUrl}/${Module}${this.accionValor(Accion)}`,data);
  }

  updateItem(Module: string, id: number, data: any, Accion: string = ''): Observable<any> {
    let AccionValor = Accion != '' ? `/${Accion}` : '';
    return this.http.put<any>(`${this.apiUrl}/${Module}${this.accionValor(Accion)}/${id}`, data);
  }

  deleteItem(Module: string, id: number, Accion: string = ''): Observable<any> {
    let AccionValor = Accion != '' ? `/${Accion}`: '';
    return this.http.delete<any>(`${this.apiUrl}/${Module}${this.accionValor(Accion)}/${id}`);
  }

patchItem(Module: string, id: number, Accion: string, data: any = {}): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${Module}/${id}${this.accionValor(Accion)}`, data);
  }

  
  accionValor(Accion: string){
    return Accion != '' ? `/${Accion}`: '';
  }
}
