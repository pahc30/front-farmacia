import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private basePath = environment.baseUrlBackend + '/compra/api';

  constructor(private http: HttpClient) { }

  save = (dato: any): Observable<any> => {
    const path = this.basePath + `/carrito/save`;
    return this.http.post<any>(path, dato).pipe(map((res) => res));
  }

  delete = (id: any): Observable<any> => {
    const path = this.basePath + `/carrito/delete/${id}`;
    return this.http.post<any>(path, null).pipe(map((res) => res));
  }

  list = (idUser:any): Observable<any> => {
    const path = this.basePath + `/carrito/list/${idUser}`;
    return this.http.post<any>(path, null).pipe(map((res) => res));
  }

}
