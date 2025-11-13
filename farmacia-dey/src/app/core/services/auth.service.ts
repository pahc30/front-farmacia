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
    return localStorage.getItem('jwtToken');
  }

  /**
   * Decodifica el payload del JWT de forma segura
   */
  private decodeJWTPayload(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decodificando JWT:', error);
      return null;
    }
  }

  getUserRole(): string | null {
    const payload = this.decodeJWTPayload();
    return payload?.rol || null;
  }

  isLogged(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeJWTPayload();
    if (!payload) return false;

    // Verificar si el token no ha expirado
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }

  getUsername(): string | null {
    const payload = this.decodeJWTPayload();
    return payload?.sub || null;
  }

  getUserId(): number | null {
    const payload = this.decodeJWTPayload();
    if (payload?.userId) {
      return payload.userId;
    }
    
    // Fallback al localStorage para compatibilidad
    const usuarioServiceId = localStorage.getItem('usuarioServiceId');
    return usuarioServiceId ? parseInt(usuarioServiceId) : null;
  }

  getNombres(): string | null {
    const payload = this.decodeJWTPayload();
    return payload?.nombres || null;
  }

  getApellidos(): string | null {
    const payload = this.decodeJWTPayload();
    return payload?.apellidos || null;
  }

  getNombreCompleto(): string {
    const nombres = this.getNombres();
    const apellidos = this.getApellidos();
    
    if (nombres && apellidos) {
      return `${nombres} ${apellidos}`;
    } else if (nombres) {
      return nombres;
    } else if (apellidos) {
      return apellidos;
    } else {
      return this.getUsername() || 'Usuario';
    }
  }

  getInfoUsuario(): any {
    const payload = this.decodeJWTPayload();
    if (!payload) return null;

    return {
      username: payload.sub,
      rol: payload.rol,
      id: this.getUserId(),
      nombres: payload.nombres,
      apellidos: payload.apellidos,
      nombreCompleto: this.getNombreCompleto()
    };
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
    // Solo limpiar datos de autenticación, mantener otros datos del navegador
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('usuarioServiceId'); // Solo mantener este para compatibilidad
    // Remover datos inseguros que ya no deberían existir
    localStorage.removeItem('user');
    localStorage.removeItem('username'); 
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('session');

    this.router.navigate(['auth/login']);
  }
}
