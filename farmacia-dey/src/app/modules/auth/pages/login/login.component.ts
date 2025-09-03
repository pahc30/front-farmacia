import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MensajesService } from '../../../../core/services/mensajes.service';
import { AuthService } from '../../services/auth.service';
import { FormValidationUtils } from '../../../../utils/form-validation-utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
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
      username: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(45)],
      ],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.frmValidationUtils = new FormValidationUtils(this.form);
  }

  onLogin(): void {
    if (this.form.invalid) {
      for (const control of Object.keys(this.form.controls)) {
        this.form.controls[control].markAsTouched();
      }
      return;
    }

    const username = this.form.get('username')?.value;
    const password = this.form.get('password')?.value;

    const dato = {
      username: username,
      password: password,
    };

    this.authService.login(dato).subscribe({
      next: (res) => {
        if(res?.estado == 0){
          this.mensaje.showMessageError(res?.mensaje);
        }else{
          localStorage.setItem('user', JSON.stringify(res?.dato?.user));
          localStorage.setItem('jwtToken', res?.dato?.accessToken);

          const rol = res?.dato?.user?.rol;
          if(rol && rol.toUpperCase() == 'ADMINISTRADOR'){
            this.router.navigate(['admin/dashboard']);
          }else{
            this.router.navigate(['client/home']);
          }

        }
      },
      error: (err) => {
        this.mensaje.showMessageErrorObservable(err);
      },
      complete: () => {},
    });
  }


  onKeyEnter(event: any): void{
    if(event.charCode == 13){
      this.onLogin();
    }
  }

  onRegister(): void{
    this.router.navigate(['auth/register']);
  }
}
