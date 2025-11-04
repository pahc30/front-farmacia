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
    this.compraService.list(user.id).subscribe({
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
    this.metodoPagoService.obtenerTransaccionesPorCompra(compraId).subscribe({
      next: (res) => {
        console.log('Transacciones:', res);
        // Aquí puedes mostrar las transacciones en un modal o expandir la fila
      },
      error: (err) => {
        this.mensaje.showMessageErrorObservable(err);
      }
    });
  }

  calcularTotalProductos = (detalleCompra: any[]): number => {
    if (!detalleCompra) return 0;
    return detalleCompra.reduce((total, detalle) => total + detalle.cantidad, 0);
  }
}
