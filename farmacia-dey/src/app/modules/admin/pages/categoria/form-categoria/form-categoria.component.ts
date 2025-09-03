import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MensajesService } from '../../../../../core/services/mensajes.service';
import { FormValidationUtils } from '../../../../../utils/form-validation-utils';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-form-categoria',
  templateUrl: './form-categoria.component.html',
  styleUrl: './form-categoria.component.css'
})
export class FormCategoriaComponent implements OnInit {

  frmValidationUtils!: FormValidationUtils;
  form!: FormGroup;

  id: any = null;
  categoria: any = null;

  constructor(private formBuilder: FormBuilder,
    private mensaje: MensajesService,
    private categoriaService: CategoriaService,
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
      nombre: [this.categoria?.nombre, [Validators.required, Validators.maxLength(45)]],
      descripcion: [this.categoria?.descripcion, [Validators.required, Validators.maxLength(250)]],

    });

    this.frmValidationUtils = new FormValidationUtils(this.form);
  }

  find = () => {
    this.categoriaService.find(this.id).subscribe({
      next: (res) => {
        this.categoria = res.dato;
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
    this.categoriaService.save(dato).subscribe({
      next: (res) => {
        this.mensaje.showMessageSuccess('Categoría registrado');
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
    this.categoriaService.update(dato, id).subscribe({
      next: (res) => {
        this.mensaje.showMessageSuccess('Categoría actualizado');
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
    this.router.navigate(['admin/categoria']);
  }

  onClickGuardar = () => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dato = {
      nombre: this.form.get('nombre')?.value,
      descripcion: this.form.get('descripcion')?.value,
    };

    const confirmation = this.mensaje.crearConfirmacion(`¿Seguro que desea ${this.categoria? 'actualizar': 'registrar'} los datos?`);
    confirmation.componentInstance.onSi.subscribe(() => {
      if(this.categoria){
        this.update(dato, this.categoria.id)
      }else{
        this.save(dato);
      }
    });

  }

}
