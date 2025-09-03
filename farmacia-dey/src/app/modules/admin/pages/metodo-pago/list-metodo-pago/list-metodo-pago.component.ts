import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MensajesService } from '../../../../../core/services/mensajes.service';
import { FormValidationUtils } from '../../../../../utils/form-validation-utils';
import { MetodopagoService } from '../../../services/metodo-pago.service';

@Component({
  selector: 'app-list-metodo-pago',
  templateUrl: './list-metodo-pago.component.html',
  styleUrl: './list-metodo-pago.component.css'
})
export class ListMetodoPagoComponent  implements OnInit {

  displayedColumns: string[] = [
    'id', 'tipo', 'descripcion', 'acciones'
  ];
  dataSource!: MatTableDataSource<any[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  frmValidationUtils!: FormValidationUtils;
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private mensaje: MensajesService,
    private metodopagoService: MetodopagoService,
    private router: Router,) { }

  ngOnInit(): void {
    this.initForm();
    this.listar();
  }

  initForm = () => {
    this.form = this.formBuilder.group({
      filter: ''
    });

    this.frmValidationUtils = new FormValidationUtils(this.form);
  }

  listar = () => {
    this.mensaje.showLoading();
    this.metodopagoService.list().subscribe({
      next: (res) => {
        const data = res.dato;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        this.mensaje.showMessageErrorObservable(err);
      },
      complete: () => {
        this.mensaje.closeLoading();
      }
    });
  }

  eliminar = (id: any) => {
    this.mensaje.showLoading();
    this.metodopagoService.delete(id).subscribe({
      next: (res) => {
        this.mensaje.showMessageSuccess('Registro eliminado correctamente');
      },
      error: (err) => {
        this.mensaje.showMessageErrorObservable(err);
      },
      complete: () => {
        this.mensaje.closeLoading();
        this.listar();
      }
    });
  }

  onClickNuevo = () => {
    this.router.navigate(['admin/metodo-pago/add']);
  }

  onClickBuscar = () => {
    const filter = this.form.controls['filter'].value;
    this.dataSource.filter = filter.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onClickEditar = (item: any) => {
    this.router.navigate(['admin/metodo-pago/edit', item.id]);
  }

  onClickEliminar = (item: any) => {
    const confirmation = this.mensaje.crearConfirmacion('¿Desea eliminar el registro?');
    confirmation.componentInstance.onSi.subscribe(() => {
      this.eliminar(item.id);
    });
  }
}
