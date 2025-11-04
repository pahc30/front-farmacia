import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetodopagoService {
  private basePath = environment.baseUrlBackend + '/metodopago/api';
  private pagoPath = environment.baseUrlBackend + '/metodopago/api/v1/pagos';

  constructor(private http: HttpClient) { }

  // Métodos originales para CRUD de métodos de pago
  save = (dato: any): Observable<any> => {
    const path = this.basePath + `/v1/metodopago/save`;
    return this.http.post<any>(path, dato).pipe(map((res) => res));
  }

  update = (dato: any, id: any): Observable<any> => {
    const path = this.basePath + `/v1/metodopago/update/${id}`;
    return this.http.post<any>(path, dato).pipe(map((res) => res));
  }

  delete = (id: any): Observable<any> => {
    const path = this.basePath + `/v1/metodopago/delete/${id}`;
    return this.http.post<any>(path, null).pipe(map((res) => res));
  }

  find = (id: any): Observable<any> => {
    const path = this.basePath + `/v1/metodopago/find/${id}`;
    return this.http.post<any>(path, null).pipe(map((res) => res));
  }

  list = (): Observable<any> => {
    const path = this.basePath + `/metodopago/list`;
    return this.http.post<any>(path, null).pipe(map((res) => res));
  }

  // Nuevos métodos para el sistema de pagos
  crearPaymentIntent = (dato: any): Observable<any> => {
    const path = this.pagoPath + `/crear-intent`;
    return this.http.post<any>(path, dato).pipe(map((res) => res));
  }

  confirmarPago = (transaccionId: number): Observable<any> => {
    const path = this.pagoPath + `/confirmar/${transaccionId}`;
    return this.http.post<any>(path, {}).pipe(map((res) => res));
  }

  obtenerEstadoTransaccion = (transaccionId: number): Observable<any> => {
    const path = this.pagoPath + `/transaccion/${transaccionId}`;
    return this.http.get<any>(path).pipe(map((res) => res));
  }

  obtenerTransaccionesPorCompra = (compraId: number): Observable<any> => {
    const path = this.pagoPath + `/compra/${compraId}`;
    return this.http.get<any>(path).pipe(map((res) => res));
  }

  // Métodos para descarga de boletas PDF
  descargarBoletaPorTransaccion = (transaccionId: number): Observable<HttpResponse<Blob>> => {
    const path = this.pagoPath + `/boleta/transaccion/${transaccionId}`;
    return this.http.get(path, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  descargarBoletaPorCompra = (compraId: number): Observable<HttpResponse<Blob>> => {
    const path = this.pagoPath + `/boleta/compra/${compraId}`;
    return this.http.get(path, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}
