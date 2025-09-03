import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthJWTService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return  localStorage.getItem('jwtToken') ;
  }

  getUserRole(): string | null {
    return  localStorage.getItem('role') ;
  }

  isLogged(): boolean {
    return this.getUsername() != null && this.getToken() != null;
  }

  getUsername(): string | null {
    return  localStorage.getItem('username') ;
  }

  getInfoUsuario(): any {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  getNotariaId(): any{
    return this.getInfoUsuario()?.notaria?.notariaId;
  }

  getNotariaRuc(): any{
    if(this.getInfoUsuario()?.notaria){
      return this.getInfoUsuario()?.notaria?.ruc;
    }
    return 'notaria';
  }

  logout(): void {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      localStorage.removeItem('session');
      localStorage.clear();


    this.router.navigate(['auth/login']);
  }
}
