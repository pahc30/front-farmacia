import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private basePath = environment.baseUrlBackend + '/producto/api';

  constructor(private http: HttpClient) { }

  save = (dato: any): Observable<any> => {
    const path = this.basePath + `/producto/save`;
    return this.http.post<any>(path, dato).pipe(map((res) => res));
  }

  update = (dato: any, id: any): Observable<any> => {
    const path = this.basePath + `/producto/update/${id}`;
    return this.http.post<any>(path, dato).pipe(map((res) => res));
  }

  updateWithoutImage = (dato: any, id: any): Observable<any> => {
    const path = this.basePath + `/producto/update-without-image/${id}`;
    return this.http.post<any>(path, dato).pipe(map((res) => res));
  }

  delete = (id: any): Observable<any> => {
    const path = this.basePath + `/producto/delete/${id}`;
    return this.http.post<any>(path, null).pipe(map((res) => res));
  }

  find = (id: any): Observable<any> => {
    const path = this.basePath + `/producto/find/${id}`;
    return this.http.post<any>(path, null).pipe(map((res) => res));
  }

  list = (): Observable<any> => {
    const path = this.basePath + `/producto/list`;
    return this.http.post<any>(path, null).pipe(map((res) => res));
  }

}
