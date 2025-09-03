import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MensajesService } from '../../../../../core/services/mensajes.service';
import { FormValidationUtils } from '../../../../../utils/form-validation-utils';
import { ProductoService } from '../../../services/producto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { forkJoin, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-form-producto',
  templateUrl: './form-producto.component.html',
  styleUrl: './form-producto.component.css'
})
export class FormProductoComponent implements OnInit {

  frmValidationUtils!: FormValidationUtils;
  form!: FormGroup;

  id: any = null;
  producto: any = null;
  categorias: any[] = [];
  imagen: any = File;
  imagenPreview: any = '';

  constructor(private formBuilder: FormBuilder,
    private mensaje: MensajesService,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.initForm();

    this.inicializarData();
  }

  initForm = () => {
    this.form = this.formBuilder.group({
      codigo: [this.producto?.codigo, [Validators.required, Validators.maxLength(45)]],
      nombre: [this.producto?.nombre, [Validators.required, Validators.maxLength(70)]],
      descripcion: [this.producto?.descripcion, [Validators.maxLength(200)]],
      precio: [this.producto?.precio, [Validators.required, Validators.min(0)]],
      stock: [this.producto?.stock, [Validators.required, Validators.min(0)]],
      categoria: [this.producto?.categoria.id, [Validators.required]],
    });
    this.imagen = null;

    this.frmValidationUtils = new FormValidationUtils(this.form);
  }

  inicializarData = () => {
    this.mensaje.showLoading();
    forkJoin({
      categorias: this.categoriaService.list(),
      producto: this.id ? this.productoService.find(this.id) : of(null)
    })
      .pipe(
        map((res) => {
          this.categorias = res.categorias['dato'];
          this.producto = this.id ? res.producto['dato'] : null;
        })
      )
      .subscribe({
        next: (res) => { },
        error: (err) => {
          this.mensaje.showMessageErrorObservable(err);
        },
        complete: () => {
          this.mensaje.closeLoading();
          this.initForm();
        },
      });
  }

  save = (dato: any) => {
    this.mensaje.showLoading();
    this.productoService.save(dato).subscribe({
      next: (res) => {
        this.mensaje.showMessageSuccess('Producto registrado');
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

  update = (dato: any, id: any) => {

    dato.id = id;

    this.mensaje.showLoading();
    this.productoService.update(dato, id).subscribe({
      next: (res) => {
        this.mensaje.showMessageSuccess('Producto actualizado');
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
    this.router.navigate(['admin/producto']);
  }

  onClickGuardar = () => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    if (this.imagen) {
      formData.append('imagen', this.imagen, this.imagen.name);
    }

    const dato = {
      id: this.producto?.id,
      descripcion: this.form.get('descripcion')?.value,
      precio: this.form.get('precio')?.value,
      stock: this.form.get('stock')?.value,
      codigo: this.form.get('codigo')?.value,
      nombre: this.form.get('nombre')?.value,
      categoria: {
        id: this.form.get('categoria')?.value,
      },
      minimaCompra: 1,
      url: this.producto?.url,
    };

    formData.append('producto', new Blob([JSON.stringify(dato)], { type: 'application/json' }));

    const confirmation = this.mensaje.crearConfirmacion(`¿Seguro que desea ${this.producto ? 'actualizar' : 'registrar'} los datos?`);
    confirmation.componentInstance.onSi.subscribe(() => {
      if (this.producto) {
        this.update(formData, this.producto.id)
      } else {
        this.save(formData);
      }
    });

  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagen = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(this.imagen);
    }
  }

}
