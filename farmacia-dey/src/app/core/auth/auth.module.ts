import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtInterceptor } from './auth.interceptor';

@NgModule({
    imports  : [
    ],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      provideHttpClient(withInterceptorsFromDi()),
    ]
})
export class AuthJWTModule
{
}
