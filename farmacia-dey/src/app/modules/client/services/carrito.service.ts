import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private basePath = environment.baseUrlBackend + '/carrito';

  constructor(private http: HttpClient) { }

  save = (dato: any): Observable<any> => {
    const path = this.basePath + `/save`;
    return this.http.post<any>(path, dato).pipe(map((res) => res));
  }

  delete = (id: any): Observable<any> => {
    const path = this.basePath + `/delete/${id}`;
    return this.http.post<any>(path, null).pipe(map((res) => res));
  }

  list = (idUser:any): Observable<any> => {
    const path = this.basePath + `/list/${idUser}`;
    return this.http.post<any>(path, null).pipe(map((res) => res));
  }

}
