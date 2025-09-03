import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajesService } from '../../../../../core/services/mensajes.service';
import { UsuarioService } from '../../../services/usuario.service';
import { FormValidationUtils } from '../../../../../utils/form-validation-utils';

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.css'
})
export class FormUsuarioComponent implements OnInit {

  frmValidationUtils!: FormValidationUtils;
  form!: FormGroup;

  id: any = null;
  usuario: any = null;
  roles: any[] = ['USUARIO', 'ADMINISTRADOR'];

  constructor(private formBuilder: FormBuilder,
    private mensaje: MensajesService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.initForm();

    if(this.id != null){
      this.find();
    }
  }

  initForm = () => {
    this.form = this.formBuilder.group({
      identificacion: [this.usuario?.identificacion, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      nombres: [this.usuario?.nombres, [Validators.required, Validators.maxLength(45)]],
      apellidos: [this.usuario?.apellidos, [Validators.required, Validators.maxLength(45)]],
      direccion: [this.usuario?.direccion, [Validators.maxLength(45)]],
      email: [this.usuario?.email, [Validators.maxLength(45), Validators.email]],
      telefono: [this.usuario?.telefono, [Validators.maxLength(45)]],
      username: [
        this.usuario?.username,
        [Validators.required, Validators.minLength(5), Validators.maxLength(45)],
      ],
      password: [null, [Validators.required, Validators.minLength(5)]],
      rol: [this.usuario?.rol, [Validators.required]],
    });

    this.frmValidationUtils = new FormValidationUtils(this.form);
  }

  find = () => {
    this.usuarioService.find(this.id).subscribe({
      next: (res) => {
        this.usuario = res.dato;
      },
      error: (err) => {
        this.mensaje.showMessageErrorObservable(err);
      },
      complete: () => {
        this.mensaje.closeLoading();
        this.initForm();
      }
    });
  }

  save = (dato: any ) => {
    this.mensaje.showLoading();
    this.usuarioService.save(dato).subscribe({
      next: (res) => {
        this.mensaje.showMessageSuccess('Usuario registrado');
      },
      error: (err) => {
        this.mensaje.showMessageErrorObservable(err);
      },
      complete: () => {
        this.mensaje.closeLoading();
        this.initForm();
      },
    });
  }

  update = (dato: any, id: any ) => {

    dato.id = id;

    this.mensaje.showLoading();
    this.usuarioService.update(dato, id).subscribe({
      next: (res) => {
        this.mensaje.showMessageSuccess('Usuario actualizado');
      },
      error: (err) => {
        this.mensaje.showMessageErrorObservable(err);
      },
      complete: () => {
        this.mensaje.closeLoading();
        this.onClickVolver();
      },
    });
  }

  onClickVolver = () => {
    this.router.navigate(['admin/usuario']);
  }

  onClickGuardar = () => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dato = {
      apellidos: this.form.get('apellidos')?.value,
      direccion: this.form.get('direccion')?.value,
      email: this.form.get('email')?.value,
      identificacion: this.form.get('identificacion')?.value,
      nombres: this.form.get('nombres')?.value,
      telefono: this.form.get('telefono')?.value,
      username: this.form.get('username')?.value,
      password: this.form.get('password')?.value,
      rol: this.form.get('rol')?.value,
    };

    const confirmation = this.mensaje.crearConfirmacion(`¿Seguro que desea ${this.usuario? 'actualizar': 'registrar'} los datos?`);
    confirmation.componentInstance.onSi.subscribe(() => {
      if(this.usuario){
        this.update(dato, this.usuario.id)
      }else{
        this.save(dato);
      }
    });

  }

}
