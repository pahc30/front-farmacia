import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MensajesService } from '../../../../core/services/mensajes.service';
import { FormValidationUtils } from '../../../../utils/form-validation-utils';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  frmValidationUtils!: FormValidationUtils;
  form!: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private mensaje: MensajesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      identificacion: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      nombres: [null, [Validators.required, Validators.maxLength(45)]],
      apellidos: [null, [Validators.required, Validators.maxLength(45)]],
      direccion: [null, [Validators.maxLength(45)]],
      email: [null, [Validators.maxLength(45), Validators.email]],
      telefono: [null, [Validators.maxLength(45)]],
      username: [
        null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(45)],
      ],
      password: [null, [Validators.required, Validators.minLength(5)]],
    });

    this.frmValidationUtils = new FormValidationUtils(this.form);
  }

  onRegister(): void {
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
      password: this.form.get('password')?.value
    };

    this.authService.register(dato).subscribe({
      next: (res) => {
        this.mensaje.showMessageSuccess('Usuario registrado');
        this.initForm();
      },
      error: (err) => {
        this.mensaje.showMessageErrorObservable(err);
      },
      complete: () => {},
    });
  }

  onBack = () => {
    this.router.navigate(['auth/login']);
  }
}
