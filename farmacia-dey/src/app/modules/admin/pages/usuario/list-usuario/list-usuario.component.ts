import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormValidationUtils } from '../../../../../utils/form-validation-utils';
import { MensajesService } from '../../../../../core/services/mensajes.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-usuario',
  templateUrl: './list-usuario.component.html',
  styleUrl: './list-usuario.component.css'
})
export class ListUsuarioComponent implements OnInit {

  displayedColumns: string[] = [
    'id', 'identificacion', 'nombres', 'apellidos',
    'telefono', 'email', 'direccion', 'username', 'rol', 'acciones'
  ];
  dataSource!: MatTableDataSource<any[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  frmValidationUtils!: FormValidationUtils;
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private mensaje: MensajesService,
    private usuarioService: UsuarioService,
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
    this.usuarioService.list().subscribe({
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
    this.usuarioService.delete(id).subscribe({
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
    this.router.navigate(['admin/usuario/add']);
  }

  onClickBuscar = () => {
    const filter = this.form.controls['filter'].value;
    this.dataSource.filter = filter.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onClickEditar = (item: any) => {
    this.router.navigate(['admin/usuario/edit', item.id]);
  }

  onClickEliminar = (item: any) => {
    const confirmation = this.mensaje.crearConfirmacion('¿Desea eliminar el registro?');
    confirmation.componentInstance.onSi.subscribe(() => {
      this.eliminar(item.id);
    });
  }
}
