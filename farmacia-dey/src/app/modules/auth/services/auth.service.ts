import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private basePath = environment.baseUrlBackend + '/auth/api';

  constructor(private http: HttpClient) {}

  login(dato: any): Observable<any> {
    const path = this.basePath + `/auth/login`;
    return this.http.post<any>(path, dato).pipe(map((res) => res));
  }

  register(dato: any): Observable<any> {
    const path = this.basePath + `/auth/register`;
    return this.http.post<any>(path, dato).pipe(map((res) => res));
  }

}
