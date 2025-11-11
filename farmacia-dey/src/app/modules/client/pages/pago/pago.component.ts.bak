import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajesService } from '../../../../core/services/mensajes.service';
import { MetodopagoService } from '../../../admin/services/metodo-pago.service';
import { FormValidationUtils } from '../../../../utils/form-validation-utils';
import { RouteDataService } from '../../../../core/services/route-data.service';
import { CompraService } from '../../services/compra.service';
import { CarritoCounterService } from '../../../../core/services/carrito-counter.service';
import { QrScanService } from '../../services/qr-scan.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit, OnDestroy {

  // Variables principales de los datos del carrito
  datoCompra: any = null;
  productos: any[] = [];
  metodos: any[] = [];
  metodoPagoSeleccionado: any = null;
  total: number = 0;
  
  // Variables de pago con integración QR real
  transaccionCreada: any = null;
  qrData: any = null;
  qrUrl: string | null = null;
  qrToken: string | null = null;
  mostrandoPago: boolean = false;
  pagoCompletado: boolean = false;
  
  // Estados del QR
  qrGenerado: boolean = false;
  qrEscaneado: boolean = false;
  esperandoEscaneo: boolean = false;
  
  // Timer de pago
  timerActivo: boolean = false;
  tiempoRestante: number = 300; // 5 minutos
  intervalTimer: any = null;
  
  // Subscripciones
  private qrDetectionSubscription: Subscription | null = null;
  
  // Formulario para Visa
  form!: FormGroup;
  frmValidationUtils!: FormValidationUtils;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private mensaje: MensajesService,
    private metodoPagoService: MetodopagoService,
    private routeDataService: RouteDataService,
    private compraService: CompraService,
    private carritoCounterService: CarritoCounterService,
    private qrScanService: QrScanService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Obtener datos del carrito desde RouteDataService
    this.datoCompra = this.routeDataService.getData();
    
    if (!this.datoCompra) {
      this.mensaje.showMessageError('No hay datos de compra disponibles');
      this.router.navigate(['/client/carrito']);
      return;
    }

    this.productos = this.datoCompra.productos || [];
    this.metodos = this.datoCompra.metodos || [];
    this.total = this.datoCompra.total || 0;

    // Pre-seleccionar el método de pago del carrito
    if (this.datoCompra.metodoPagoId) {
      const metodoSeleccionado = this.metodos.find(m => m.id === this.datoCompra.metodoPagoId);
      if (metodoSeleccionado) {
        this.seleccionarMetodo(metodoSeleccionado);
        
        // 🚀 GENERAR PAGO AUTOMÁTICAMENTE según el método seleccionado
        setTimeout(() => {
          if (this.esYapeOPlin()) {
            console.log('🔲 Auto-iniciando pago Yape/Plin...');
            this.iniciarPagoYape();
          } else if (this.esVisa()) {
            console.log('💳 Método Visa seleccionado, esperando confirmación...');
            // Para Visa, no auto-iniciar, esperar que llene datos
          }
        }, 500);
      }
    }

    console.log('Datos de compra recibidos:', this.datoCompra);
  }

  ngOnDestroy(): void {
    this.limpiarTimer();
    this.detenerDeteccionQR();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      metodoPago: ['', Validators.required],
      // Campos para Visa
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{13,19}$/)]],
      cardNombre: ['', Validators.required],
      cardApellido: ['', Validators.required],
      cardCvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardCuotas: ['1', Validators.required],
      cardExpMonth: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      cardExpYear: ['', [Validators.required, Validators.min(2024)]]
    });

    this.frmValidationUtils = new FormValidationUtils(this.form);
  }

  seleccionarMetodo(metodo: any): void {
    console.log('🎯 Seleccionando método:', metodo);
    this.metodoPagoSeleccionado = metodo;
    this.form.patchValue({ metodoPago: metodo.id });
    console.log('✅ Método seleccionado asignado:', this.metodoPagoSeleccionado);
    console.log('📋 Es Yape/Plin:', this.esYapeOPlin());
    console.log('💳 Es Visa:', this.esVisa());
    console.log('🚨 DEBUG VISA - qrGenerado:', this.qrGenerado);
    console.log('🚨 DEBUG VISA - mostrandoPago:', this.mostrandoPago);
  }

  // Método actualizado para integrar con backend real
  async iniciarPagoYape(): Promise<void> {
    if (!this.metodoPagoSeleccionado) {
      this.mensaje.showMessageError('Selecciona un método de pago');
      return;
    }

    const metodoTexto = this.metodoPagoSeleccionado.tipo.toLowerCase();
    if (!metodoTexto.includes('yape') && !metodoTexto.includes('plin')) {
      this.mensaje.showMessageError('Método de pago no válido para Yape/Plin');
      return;
    }

    try {
      this.mensaje.showLoading();
      
      // Paso 1: Crear Payment Intent
      console.log('🚀 Creando Payment Intent...');
      const paymentData = {
        compraId: Date.now(), // Temporal, se usará el ID de compra real
        monto: this.total,
        descripcion: `Farmacia DeY - ${this.productos.length} producto(s)`
      };

      const paymentResult = await this.metodoPagoService.crearPaymentIntent(paymentData).toPromise();
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Error creando payment intent');
      }

      this.transaccionCreada = paymentResult;
      console.log('✅ Payment Intent creado:', this.transaccionCreada);

      // Paso 2: Generar QR para la transacción
      console.log('🔲 Generando QR...');
      const qrResult = await this.qrScanService.generarQRPago(this.transaccionCreada.transaccionId).toPromise();
      
      if (!qrResult.success) {
        throw new Error(qrResult.message || 'Error generando QR');
      }

      this.qrData = qrResult;
      this.qrToken = qrResult.qrToken;
      this.qrUrl = this.generarQRVisual(qrResult.qrUrl, this.total);
      
      console.log('✅ QR generado:', this.qrData);

      // Paso 3: Mostrar QR y iniciar detección
      this.mostrandoPago = true;
      this.qrGenerado = true;
      this.esperandoEscaneo = true;
      
      this.mensaje.closeLoading();
      this.mensaje.showMessageSuccess('QR generado. Escanea con tu celular para pagar');
      
      // Iniciar timer y detección
      this.iniciarTimer();
      this.iniciarDeteccionQR();

    } catch (error: any) {
      console.error('❌ Error en pago Yape:', error);
      this.mensaje.closeLoading();
      this.mensaje.showMessageError(error.message || 'Error procesando pago');
    }
  }

  // Generar QR visual usando API externa
  private generarQRVisual(qrUrl: string, monto: number): string {
    const data = encodeURIComponent(`${qrUrl}`);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${data}&bgcolor=FFFFFF&color=000000&qzone=2&format=png`;
  }

  // Iniciar detección automática de escaneo QR
  private iniciarDeteccionQR(): void {
    if (!this.qrToken) return;

    console.log('👁️ Iniciando detección de escaneo QR:', this.qrToken);
    
    this.qrDetectionSubscription = this.qrScanService.iniciarDeteccionEscaneo(this.qrToken, 2000)
      .subscribe({
        next: (estado) => {
          console.log('🔍 Estado QR:', estado);
          
          if (estado.escaneado && !this.qrEscaneado) {
            this.onQREscaneado(estado);
          }
        },
        error: (error) => {
          console.error('❌ Error detectando escaneo:', error);
          this.mensaje.showMessageError('Error verificando estado del pago');
        },
        complete: () => {
          console.log('✅ Detección de QR completada');
        }
      });
  }

  // Cuando el QR es escaneado
  private onQREscaneado(estado: any): void {
    console.log('📱 ¡QR ESCANEADO!', estado);
    
    this.qrEscaneado = true;
    this.esperandoEscaneo = false;
    this.pagoCompletado = true;
    
    this.limpiarTimer();
    this.detenerDeteccionQR();
    
    this.mensaje.showMessageSuccess('¡QR escaneado! Procesando pago automáticamente...');
    
    // Auto-confirmar el pago después de unos segundos
    setTimeout(() => {
      this.confirmarPagoAutomatico();
    }, 2000);
  }

  // Confirmar pago automáticamente después del escaneo
  private async confirmarPagoAutomatico(): Promise<void> {
    try {
      console.log('✅ Confirmando pago automáticamente...');
      
      // Confirmar en backend
      if (this.transaccionCreada) {
        const confirmResult = await this.metodoPagoService.confirmarPago(this.transaccionCreada.transaccionId).toPromise();
        console.log('Confirmación backend:', confirmResult);
      }

      // Procesar compra
      const datoCompra = this.construirDatoCompra();
      const compraResult = await this.compraService.save(datoCompra).toPromise();
      
      console.log('✅ Compra procesada:', compraResult);
      
      if (compraResult?.success !== false) {
        this.mensaje.showMessageSuccess('¡Pago completado exitosamente!');
        this.carritoCounterService.updateCount(0);
        
        // Navegar a página de éxito
        setTimeout(() => {
          this.router.navigate(["/client/pago-exitoso"]);
        }, 2000);
      } else {
        throw new Error(compraResult?.message || 'Error procesando compra');
      }

    } catch (error: any) {
      console.error('❌ Error confirmando pago:', error);
      this.mensaje.showMessageError('Error completando el pago: ' + (error.message || 'Error desconocido'));
    }
  }

  // Método manual para simular escaneo (para testing)
  simularEscaneoQR(): void {
    if (!this.qrToken) {
      this.mensaje.showMessageError('No hay QR activo');
      return;
    }

    console.log('🧪 Simulando escaneo de QR...');
    // Eliminado mensaje duplicado;
    
    this.qrScanService.confirmarEscaneoManual(this.qrToken).subscribe({
      next: (result) => {
        console.log('✅ Escaneo simulado:', result);
        if (result.success) {
          // La detección automática debería captar este cambio
          console.log('✅ Escaneo simulado exitoso');
        } else {
          this.mensaje.showMessageError('Error simulando escaneo: ' + result.message);
        }
      },
      error: (error) => {
        console.error('❌ Error simulando escaneo:', error);
        this.mensaje.showMessageError('Error simulando escaneo');
      }
    });
  }

  // Método para pago con Visa (mantener existente)
  procesarPagoVisa(): void {
    if (!this.metodoPagoSeleccionado) {
      this.mensaje.showMessageError('Selecciona un método de pago');
      return;
    }

    const metodoTexto = this.metodoPagoSeleccionado.tipo.toLowerCase();
    if (!metodoTexto.includes('visa')) {
      this.mensaje.showMessageError('Método de pago no válido para Visa');
      return;
    }

    // Validar campos de tarjeta
    if (!this.form.get('cardNumber')?.value || !this.form.get('cardNombre')?.value ||
        !this.form.get('cardApellido')?.value || !this.form.get('cardCvv')?.value) {
      this.mensaje.showMessageError('Complete los datos de la tarjeta correctamente');
      return;
    }

    this.mensaje.showLoading();
    
    setTimeout(() => {
      this.mensaje.closeLoading();
      this.confirmarPagoVisa();
    }, 2000);
  }

  // Confirmar pago Visa
  private async confirmarPagoVisa(): Promise<void> {
    try {
      const datoCompra = this.construirDatoCompra();
      console.log('📤 Datos enviados al backend para Visa:', datoCompra);
      const result = await this.compraService.save(datoCompra).toPromise();
      
      if (result?.success !== false) {
        console.log('✅ Resultado de compra Visa:', result);
        console.log('🔍 Método de pago usado:', this.metodoPagoSeleccionado);
        
        this.mensaje.showMessageSuccess('¡Pago con Visa completado exitosamente!');
        this.carritoCounterService.updateCount(0);
        
        const compraId = result?.data?.id || result?.id || 0;
        console.log('💾 CompraId obtenido:', compraId);
        
        // Guardar información de compra para la boleta
        this.routeDataService.setData({
          compraId: compraId,
          total: this.total,
          productos: this.productos,
          metodoPago: this.metodoPagoSeleccionado,
          usuarioId: this.datoCompra.usuarioId
        });
        
        setTimeout(() => {
          const pagoState = {
            compraId: compraId,
            transaccionId: 0, // Visa no usa transacciones
            monto: this.total,
            metodoPago: this.metodoPagoSeleccionado?.tipo,
            productosCount: this.productos.length
          };

          try {
            localStorage.setItem('ultimo_pago_exitoso', JSON.stringify(pagoState));
          } catch (storageError) {
            console.warn('No se pudo guardar estado de pago en localStorage:', storageError);
          }

          this.router.navigate(["/client/pago-exitoso"], {
            state: pagoState
          });
        }, 1500);
      } else {
        throw new Error(result?.message || 'Error procesando pago');
      }
    } catch (error: any) {
      this.mensaje.showMessageError('Error procesando pago: ' + error.message);
    }
  }

  // Construir datos de compra
  private construirDatoCompra(): any {
    let detalle: any[] = [];
    this.productos.forEach((item) => {
      detalle.push({
        productoId: item.producto.id,
        cantidad: item.cantidad,
        carritoCompraId: item.id,
      });
    });

    return {
      usuarioId: this.datoCompra.usuarioId,
      metodoPagoId: this.metodoPagoSeleccionado.id,
      detalleCompra: detalle,
    };
  }

  // Timer methods
  private iniciarTimer(): void {
    this.timerActivo = true;
    this.intervalTimer = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.onTimerExpired();
      }
    }, 1000);
  }

  private limpiarTimer(): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
    this.timerActivo = false;
  }

  private onTimerExpired(): void {
    this.limpiarTimer();
    this.detenerDeteccionQR();
    this.mensaje.showMessageError('Tiempo de pago expirado');
    this.regresarAlCarrito();
  }

  formatearTiempo(): string {
    const minutos = Math.floor(this.tiempoRestante / 60);
    const segundos = this.tiempoRestante % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  }

  // Cleanup
  private detenerDeteccionQR(): void {
    if (this.qrDetectionSubscription) {
      this.qrDetectionSubscription.unsubscribe();
      this.qrDetectionSubscription = null;
    }
    this.qrScanService.detenerDeteccion();
  }

  // Helper methods
  esYapeOPlin(): boolean {
    console.log('🔍 Verificando esYapeOPlin - método:', this.metodoPagoSeleccionado);
    if (!this.metodoPagoSeleccionado) {
      console.log('❌ No hay método seleccionado para Yape/Plin');
      return false;
    }
    const tipo = this.metodoPagoSeleccionado.tipo?.toLowerCase() || '';
    console.log('🔎 Tipo en minúsculas:', tipo);
    const resultado = tipo.includes('yape') || tipo.includes('plin');
    console.log('📱 Es Yape/Plin:', resultado, 'para tipo:', tipo);
    return resultado;
  }

  esVisa(): boolean {
    console.log('🔍 Verificando esVisa - método:', this.metodoPagoSeleccionado);
    if (!this.metodoPagoSeleccionado) {
      console.log('❌ No hay método seleccionado para Visa');
      return false;
    }
    const tipo = this.metodoPagoSeleccionado.tipo?.toLowerCase() || '';
    console.log('🔎 Tipo en minúsculas:', tipo);
    const resultado = tipo.includes('visa');
    console.log('💳 Es Visa:', resultado, 'para tipo:', tipo);
    console.log('🚨 DEBUG VISA - qrGenerado:', this.qrGenerado);
    console.log('🚨 DEBUG VISA - mostrandoPago:', this.mostrandoPago);
    return resultado;
  }

  // Navigation
  regresarAlCarrito(): void {
    this.limpiarTimer();
    this.detenerDeteccionQR();
    this.router.navigate(['/client/carrito']);
  }

  // Métodos legacy (mantener por compatibilidad)
  simularPagoYape(): void {
    this.iniciarPagoYape();
  }

  confirmarPago(): void {
    if (this.qrEscaneado) {
      this.mensaje.showMessageSuccess('El pago ya está siendo procesado automáticamente');
    } else {
      this.mensaje.showMessageSuccess('Esperando que escanees el QR con tu celular');
    }
  }
}

