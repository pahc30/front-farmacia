import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MensajesService } from '../../../../core/services/mensajes.service';
import { CarritoService } from '../../services/carrito.service';
import { AuthJWTService } from '../../../../core/services/auth.service';
import { MetodopagoService } from '../../../admin/services/metodo-pago.service';
import { forkJoin, map } from 'rxjs';
import { FormValidationUtils } from '../../../../utils/form-validation-utils';
import { CompraService } from '../../services/compra.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {

  displayedColumns: string[] = [
    'id', 'codigo', 'nombre',
    'precio', 'cantidad', 'categoria', 'imagen', 'acciones'
  ];
  dataSource!: MatTableDataSource<any[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  total: number  = 0;
  productos: any[] = [];
  metodos : any[] = [];

  frmValidationUtils!: FormValidationUtils;
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private mensaje: MensajesService,
    private carritoService: CarritoService,
    private metodoPagoService: MetodopagoService,
    private compraService: CompraService,
    private authService: AuthJWTService,
    private router: Router,) { }

  ngOnInit(): void {
    this.initForm();
    this.inicializarData();
  }

  initForm = () => {
    this.form = this.formBuilder.group({
      metodo: [null, [Validators.required]],
    });

    this.frmValidationUtils = new FormValidationUtils(this.form);
  }

  inicializarData = () => {
    const user = this.authService.getInfoUsuario();
    this.mensaje.showLoading();
    forkJoin({
      productos: this.carritoService.list(user.id),
      metodos: this.metodoPagoService.list(),
    })
      .pipe(
        map((res) => {
          this.productos = res.productos['dato'];
          this.metodos = res.metodos['dato'];
        })
      )
      .subscribe({
        next: (res) => { },
        error: (err) => {
          this.mensaje.showMessageErrorObservable(err);
        },
        complete: () => {
          this.mensaje.closeLoading();

          this.total = 0;
          this.productos.forEach((item: any) => {
            this.total += item.producto?.precio * item.cantidad;
          });
          this.dataSource = new MatTableDataSource(this.productos);
          this.dataSource.paginator = this.paginator;
        },
      });
  }

  save = (dato: any) => {
    this.mensaje.showLoading();
    this.compraService.save(dato).subscribe({
      next: (res) => {
        this.mensaje.showMessageSuccess('Compra realizada');
      },
      error: (err) => {
        this.mensaje.showMessageErrorObservable(err);
      },
      complete: () => {
        this.mensaje.closeLoading();
        this.initForm();
        this.inicializarData();
      },
    });
  }

  onClickEliminar = (item: any) => {
    const confirmation = this.mensaje.crearConfirmacion('¿Desea eliminar el registro?');
    confirmation.componentInstance.onSi.subscribe(() => {
      this.eliminar(item.id);
    });
  }

  onClickPagar = () => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.authService.getInfoUsuario();

    let detalle: any[] = [];
    this.productos.forEach((item) => {
      detalle.push({
        productoId: item.producto.id,
        cantidad: item.cantidad,
        carritoCompraId: item.id,
      });
    });

    const dato = {
      usuarioId: user.id,
      metodoPagoId: this.form.get('metodo')?.value,
      detalleCompra: detalle,
    };

    const confirmation = this.mensaje.crearConfirmacion(`¿Seguro que desea realizar la compra?`);
    confirmation.componentInstance.onSi.subscribe(() => {
      this.save(dato);
    });
  }

  eliminar = (id: any) => {
    this.mensaje.showLoading();
    this.carritoService.delete(id).subscribe({
      next: (res) => {
        this.mensaje.showMessageSuccess('Registro eliminado correctamente');
      },
      error: (err) => {
        this.mensaje.showMessageErrorObservable(err);
      },
      complete: () => {
        this.mensaje.closeLoading();
        this.inicializarData();
      }
    });
  }
}
