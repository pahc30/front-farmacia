import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MensajesService } from '../../../../../core/services/mensajes.service';
import { FormValidationUtils } from '../../../../../utils/form-validation-utils';
import { MetodopagoService } from '../../../services/metodo-pago.service';

@Component({
  selector: 'app-form-metodo-pago',
  templateUrl: './form-metodo-pago.component.html',
  styleUrl: './form-metodo-pago.component.css'
})
export class FormMetodoPagoComponent implements OnInit {

  frmValidationUtils!: FormValidationUtils;
  form!: FormGroup;

  id: any = null;
  metodopago: any = null;

  constructor(private formBuilder: FormBuilder,
    private mensaje: MensajesService,
    private metodopagoService: MetodopagoService,
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
      tipo: [this.metodopago?.tipo, [Validators.required, Validators.maxLength(45)]],
      descripcion: [this.metodopago?.descripcion, [Validators.required, Validators.maxLength(250)]],

    });

    this.frmValidationUtils = new FormValidationUtils(this.form);
  }

  find = () => {
    this.metodopagoService.find(this.id).subscribe({
      next: (res) => {
        this.metodopago = res.dato;
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
    this.metodopagoService.save(dato).subscribe({
      next: (res) => {
        this.mensaje.showMessageSuccess('Método de pago registrado');
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
    this.metodopagoService.update(dato, id).subscribe({
      next: (res) => {
        this.mensaje.showMessageSuccess('Método de pago actualizado');
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
    this.router.navigate(['admin/metodo-pago']);
  }

  onClickGuardar = () => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dato = {
      tipo: this.form.get('tipo')?.value,
      descripcion: this.form.get('descripcion')?.value,
    };

    const confirmation = this.mensaje.crearConfirmacion(`¿Seguro que desea ${this.metodopago? 'actualizar': 'registrar'} los datos?`);
    confirmation.componentInstance.onSi.subscribe(() => {
      if(this.metodopago){
        this.update(dato, this.metodopago.id)
      }else{
        this.save(dato);
      }
    });

  }

}
