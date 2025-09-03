import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MensajesService } from '../../../../core/services/mensajes.service';
import { FormValidationUtils } from '../../../../utils/form-validation-utils';
import { ProductoService } from '../../../admin/services/producto.service';
import { CategoriaService } from '../../../admin/services/categoria.service';
import { forkJoin, map } from 'rxjs';
import { AuthJWTService } from '../../../../core/services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  frmValidationUtils!: FormValidationUtils;
  form!: FormGroup;

  categorias: any[] = [];
  productos: any[] = [];
  items: any[] = [];
  pagina: any[] = [];

  pageSize = 6;
  pageIndex = 0;
  totalItems = 0;

  constructor(private formBuilder: FormBuilder,
    private mensaje: MensajesService,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private authService: AuthJWTService,
    private carritoService: CarritoService,
    private router: Router,) { }

  ngOnInit(): void {
    this.initForm();
    this.inicializarData();
  }

  initForm = () => {
    this.form = this.formBuilder.group({
      filter: '',
      categoria: '',
    });

    this.frmValidationUtils = new FormValidationUtils(this.form);
  }

  inicializarData = () => {
    this.mensaje.showLoading();
    forkJoin({
      categorias: this.categoriaService.list(),
      productos: this.productoService.list(),
    })
      .pipe(
        map((res) => {
          this.categorias = res.categorias['dato'];
          this.productos = res.productos['dato'];
        })
      )
      .subscribe({
        next: (res) => { },
        error: (err) => {
          this.mensaje.showMessageErrorObservable(err);
        },
        complete: () => {
          this.mensaje.closeLoading();
          this.onClickBuscar();
        },
      });
  }

  onClickBuscar = (event: any = null) => {
    const filter = this.form.controls['filter']?.value?.trim();
    const categoria = event ?? this.form.controls['categoria'].value;

    this.items = this.productos.filter((x) => ((x.nombre.includes(filter) || x.categoria.nombre.includes(filter)) && (categoria == 0 || x.categoria.id == categoria)));
    this.totalItems = this.items.length;
    this.actualizarPagina();
  }

  onClickMas = (item: any) => {
    if (!item.cantidad && item.stock > 0) {
      item.cantidad = 1;
    } else {
      if(item.stock > item.cantidad){
        item.cantidad += 1;
      }
    }
  }

  onClickMenos = (item: any) => {
    if (!item.cantidad) {
      item.cantidad = 0;
    } else {
      item.cantidad -= 1;
      if (item.cantidad < 0) {
        item.cantidad = 0;
      }
    }
  }

  onClickAgregarCarrito = (item: any) => {
    const user = this.authService.getInfoUsuario();

    const dato = {
      cantidad: item?.cantidad,
      usuarioId: user.id,
      productoId: item.id,
    };

    this.mensaje.showLoading();
    this.carritoService.save(dato).subscribe({
      next: (res) => {
        this.mensaje.showMessageSuccess('Se agregó el producto al carrito de compras');
      },
      error: (err) => {
        this.mensaje.showMessageErrorObservable(err);
      },
      complete: () => {
        this.mensaje.closeLoading();
      }
    });
  }

  actualizarPagina(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagina = this.items.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.actualizarPagina();
  }
}
