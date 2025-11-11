import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetodopagoService } from '../../../admin/services/metodo-pago.service';
import { MensajesService } from '../../../../core/services/mensajes.service';

@Component({
  selector: 'app-pago-exitoso',
  templateUrl: './pago-exitoso.component.html',
  styleUrls: ['./pago-exitoso.component.css']
})
export class PagoExitosoComponent implements OnInit {

  compraId: number = 0;
  transaccionId: number = 0;
  monto: number = 0;
  metodoPago: string = '';
  productosCount: number = 0;
  fechaActual: Date = new Date();
  qrToken: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metodoPagoService: MetodopagoService,
    private mensaje: MensajesService
  ) { }

  ngOnInit(): void {
    // Obtener parámetros de la URL y estado del router
    this.compraId = +this.route.snapshot.paramMap.get('compraId')! || 0;
    
    // Obtener información adicional del state del router (si viene del pago)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state as Record<string, any>;
      console.log('📦 Estado recibido del router:', state);
      this.compraId = state['compraId'] ?? this.compraId;
      this.transaccionId = state['transaccionId'] ?? this.transaccionId;
      this.monto = state['monto'] ?? this.monto;
      this.metodoPago = state['metodoPago'] ?? this.metodoPago;
      this.productosCount = state['productosCount'] ?? this.productosCount;
      this.qrToken = state['qrToken'] ?? this.qrToken;
    }
    
    // Si falta información, obtener de localStorage como fallback
    if (!this.compraId || !this.transaccionId) {
      const pagoInfo = localStorage.getItem('ultimo_pago_exitoso');
      if (pagoInfo) {
        const info = JSON.parse(pagoInfo);
        console.log('💾 Datos recuperados de localStorage:', info);
        this.compraId = info.compraId ?? this.compraId;
        this.transaccionId = info.transaccionId ?? this.transaccionId;
        this.monto = info.monto ?? this.monto;
        this.metodoPago = info.metodoPago ?? this.metodoPago;
        this.productosCount = info.productosCount ?? this.productosCount;
        this.qrToken = info.qrToken ?? this.qrToken;
        
        // Limpiar localStorage después de usar
        localStorage.removeItem('ultimo_pago_exitoso');
      } else {
        console.warn('⚠️ No se encontró información en localStorage para ultimo_pago_exitoso');
      }
    }
    
    console.log('🎉 Pago Exitoso - Información:', {
      compraId: this.compraId,
      transaccionId: this.transaccionId,
      monto: this.monto,
      metodoPago: this.metodoPago,
      productosCount: this.productosCount
    });
  }

  descargarBoleta(): void {
    console.log("🔍 Debug descarga:", { compraId: this.compraId, transaccionId: this.transaccionId });
    if (!this.compraId && !this.transaccionId) {
      this.mensaje.showMessageError('No hay información de compra para descargar la boleta');
      return;
    }

    this.mensaje.showLoading();
    
    // Intentar descargar por compra primero, si no por transacción
    const downloadObservable = this.compraId > 0 
      ? this.metodoPagoService.descargarBoletaPorCompra(this.compraId)
      : this.metodoPagoService.descargarBoletaPorTransaccion(this.transaccionId);

    downloadObservable.subscribe({
      next: (response: any) => {
        const blob = response.body;
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `boleta-${this.compraId || this.transaccionId}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
          this.mensaje.showMessageSuccess('Boleta descargada exitosamente');
        }
      },
      error: (err: any) => {
        console.error('Error descargando boleta:', err);
        this.mensaje.showMessageError(`Error al descargar la boleta: ${err?.error?.message || err?.message || "Error desconocido"}`);
      },
      complete: () => {
        this.mensaje.closeLoading();
      }
    });
  }

  verMisCompras(): void {
    this.router.navigate(['/client/compras']);
  }

  continuarComprando(): void {
    this.router.navigate(['/client/tienda']);
  }

  volverInicio(): void {
    this.router.navigate(['/client/home']);
  }
}
