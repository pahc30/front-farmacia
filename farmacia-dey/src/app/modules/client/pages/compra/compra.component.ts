import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../services/compra.service';
import { MensajesService } from '../../../../core/services/mensajes.service';
import { AuthJWTService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent implements OnInit {

  compras: any[] = [];

  constructor(private compraService: CompraService, private mensaje: MensajesService,
    private authService: AuthJWTService
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
}
