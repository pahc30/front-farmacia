import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetodopagoService {
  private basePath = environment.baseUrlBackend + '/metodopago/api';

  constructor(private http: HttpClient) { }

  save = (dato: any): Observable<any> => {
    const path = this.basePath + `/metodopago/save`;
    return this.http.post<any>(path, dato).pipe(map((res) => res));
  }

  update = (dato: any, id: any): Observable<any> => {
    const path = this.basePath + `/metodopago/update/${id}`;
    return this.http.post<any>(path, dato).pipe(map((res) => res));
  }

  delete = (id: any): Observable<any> => {
    const path = this.basePath + `/metodopago/delete/${id}`;
    return this.http.post<any>(path, null).pipe(map((res) => res));
  }

  find = (id: any): Observable<any> => {
    const path = this.basePath + `/metodopago/find/${id}`;
    return this.http.post<any>(path, null).pipe(map((res) => res));
  }

  list = (): Observable<any> => {
    const path = this.basePath + `/metodopago/list`;
    return this.http.post<any>(path, null).pipe(map((res) => res));
  }

}
