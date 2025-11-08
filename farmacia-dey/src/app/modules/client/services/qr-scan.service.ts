import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QrScanService {
  
  private readonly API_BASE = 'http://localhost:7014/metodopago/api/v1';
  private pollingInterval: any;
  private qrScannedSubject = new Subject<any>();

  constructor(private http: HttpClient) { }

  /**
   * Genera un QR de pago para una transacción
   */
  generarQRPago(transaccionId: number): Observable<any> {
    return this.http.post(`${this.API_BASE}/pagos/qr/generar/${transaccionId}`, {});
  }

  /**
   * Verifica el estado de un QR
   */
  verificarEstadoQR(qrToken: string): Observable<any> {
    return this.http.get(`${this.API_BASE}/pagos/qr/estado/${qrToken}`);
  }

  /**
   * Confirma manualmente el escaneo de un QR (para testing)
   */
  confirmarEscaneoManual(qrToken: string): Observable<any> {
    return this.http.post(`${this.API_BASE}/pagos/qr/confirmar-escaneo/${qrToken}`, {});
  }

  /**
   * Inicia el polling para verificar si el QR ha sido escaneado
   */
  iniciarDeteccionEscaneo(qrToken: string, intervaloMs: number = 2000): Observable<any> {
    return new Observable(observer => {
      const polling = interval(intervaloMs).subscribe(() => {
        this.verificarEstadoQR(qrToken).subscribe({
          next: (estado) => {
            observer.next(estado);
            if (estado.escaneado) {
              // QR fue escaneado, detener polling
              polling.unsubscribe();
              observer.complete();
            }
          },
          error: (error) => {
            observer.error(error);
            polling.unsubscribe();
          }
        });
      });

      // Cleanup function
      return () => {
        if (polling) {
          polling.unsubscribe();
        }
      };
    });
  }

  /**
   * Observable para escuchar cuando un QR es escaneado
   */
  get qrScanned$(): Observable<any> {
    return this.qrScannedSubject.asObservable();
  }

  /**
   * Emite un evento cuando un QR es escaneado
   */
  notificarQREscaneado(data: any): void {
    this.qrScannedSubject.next(data);
  }

  /**
   * Detiene cualquier polling activo
   */
  detenerDeteccion(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}
