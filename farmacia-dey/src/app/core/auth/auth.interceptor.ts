import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthJWTService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthJWTService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {


    if (request.headers.has('skip')) {
      request = request.clone({ headers: request.headers.delete('skip') });
      return next.handle(request);
    }

    if (request.url != 'none' &&
      !request.url.endsWith('auth/api/auth/login') &&
      !request.url.endsWith('auth/api/auth/register')) {
      const jwtToken = this.authService.getToken();

      if(jwtToken){
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
      }
    }

    return next.handle(request).pipe(
      catchError((err) => {

        if (err instanceof HttpErrorResponse && err.status === 0) {
          this.authService.logout();
        } else if (err.status === 0) {
        }
        return throwError(() => err);
      })
    );
  }
}
