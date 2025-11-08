import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../services/compra.service';
import { MensajesService } from '../../../../core/services/mensajes.service';
import { AuthJWTService } from '../../../../core/services/auth.service';
import { MetodopagoService } from '../../../admin/services/metodo-pago.service';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent implements OnInit {

  compras: any[] = [];
  transacciones: { [compraId: number]: any[] } = {};
  mostrandoTransacciones: { [compraId: number]: boolean } = {};
  cargandoTransacciones: { [compraId: number]: boolean } = {};

  constructor(
    private compraService: CompraService, 
    private mensaje: MensajesService,
    private authService: AuthJWTService,
    private metodoPagoService: MetodopagoService
  ) { }

  ngOnInit(): void {
    this.listar();
  }

  listar = () => {
    this.mensaje.showLoading();

    const user = this.authService.getInfoUsuario();
    this.compraService.list(parseInt(localStorage.getItem("usuarioServiceId") || user.id.toString())).subscribe({
      next: (res) => {
        this.compras = res.dato;
      },
      error: (err) => {
        this.mensaje.showMessageErrorObservable(err);
      },
      complete: () => {
        this.mensaje.closeLoading();
      },
    });
  }

  descargarBoleta = (compraId: number) => {
    this.mensaje.showLoading();
    this.metodoPagoService.descargarBoletaPorCompra(compraId).subscribe({
      next: (response) => {
        const blob = response.body;
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `boleta_compra_${compraId}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
          this.mensaje.showMessageSuccess('Boleta descargada exitosamente');
        }
      },
      error: (err) => {
        this.mensaje.showMessageErrorObservable(err);
      },
      complete: () => {
        this.mensaje.closeLoading();
      }
    });
  }

  obtenerTransacciones = (compraId: number) => {
    // Toggle visibility
    if (this.mostrandoTransacciones[compraId]) {
      this.mostrandoTransacciones[compraId] = false;
      return;
    }

    // Si ya tenemos las transacciones cargadas, solo mostrarlas
    if (this.transacciones[compraId]) {
      this.mostrandoTransacciones[compraId] = true;
      return;
    }

    // Cargar transacciones desde el backend
    this.cargandoTransacciones[compraId] = true;
    this.metodoPagoService.obtenerTransaccionesPorCompra(compraId).subscribe({
      next: (res) => {
        console.log('Transacciones recibidas:', res);
        this.transacciones[compraId] = res || [];
        this.mostrandoTransacciones[compraId] = true;
        this.cargandoTransacciones[compraId] = false;
        
        if (this.transacciones[compraId].length === 0) {
          // MensajesService no define showMessageInfo; usar showMessageSuccess para mostrar información
          this.mensaje.showMessageSuccess('Esta compra no tiene transacciones registradas');
        }
      },
      error: (err) => {
        console.error('Error cargando transacciones:', err);
        this.cargandoTransacciones[compraId] = false;
        this.mensaje.showMessageErrorObservable(err);
      }
    });
  }

  calcularTotalProductos = (detalleCompra: any[]): number => {
    if (!detalleCompra) return 0;
    return detalleCompra.reduce((total, detalle) => total + detalle.cantidad, 0);
  }

  // Métodos helper para las transacciones
  getEstadoClass = (estado: string): string => {
    const clases: { [key: string]: string } = {
      'COMPLETADA': 'bg-green-100 text-green-800',
      'PENDIENTE': 'bg-yellow-100 text-yellow-800',
      'FALLIDA': 'bg-red-100 text-red-800',
      'PROCESANDO': 'bg-blue-100 text-blue-800',
      'CANCELADA': 'bg-gray-100 text-gray-800',
      'REEMBOLSADA': 'bg-purple-100 text-purple-800'
    };
    return clases[estado] || 'bg-gray-100 text-gray-800';
  }

  getEstadoTexto = (estado: string): string => {
    const estados: { [key: string]: string } = {
      'COMPLETADA': 'Completada',
      'PENDIENTE': 'Pendiente',
      'FALLIDA': 'Fallida',
      'PROCESANDO': 'Procesando',
      'CANCELADA': 'Cancelada',
      'REEMBOLSADA': 'Reembolsada'
    };
    return estados[estado] || estado;
  }

  formatearFecha = (fecha: string): string => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES');
  }
}
