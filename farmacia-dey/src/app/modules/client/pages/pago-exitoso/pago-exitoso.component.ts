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
  fechaActual: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metodoPagoService: MetodopagoService,
    private mensaje: MensajesService
  ) { }

  ngOnInit(): void {
    this.compraId = +this.route.snapshot.paramMap.get('compraId')!;
  }

  descargarBoleta(): void {
    if (!this.compraId) return;

    this.mensaje.showLoading();
    this.metodoPagoService.descargarBoletaPorCompra(this.compraId).subscribe({
      next: (response: any) => {
        const blob = response.body;
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `boleta-compra-${this.compraId}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error: (err: any) => {
        this.mensaje.showMessageErrorObservable(err);
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
    this.router.navigate(['/client/home']);
  }
}
