import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { UsuarioService } from '../../services/usuario.service';
import { MetodopagoService } from '../../services/metodo-pago.service';
import { MensajesService } from '../../../../core/services/mensajes.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  metricas = {
    productos: 0,
    categorias: 0,
    usuarios: 0,
    metodosPago: 0
  };

  isLoading = true;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private usuarioService: UsuarioService,
    private metodoPagoService: MetodopagoService,
    private mensaje: MensajesService
  ) { }

  ngOnInit(): void {
    this.cargarMetricas();
  }

  cargarMetricas(): void {
    this.isLoading = true;
    
    // Cargar productos
    this.productoService.list().subscribe({
      next: (res: any) => {
        this.metricas.productos = res.dato ? res.dato.length : 0;
      },
      error: (err: any) => {
        console.error('Error cargando productos:', err);
        this.metricas.productos = 0;
      }
    });

    // Cargar categorías
    this.categoriaService.list().subscribe({
      next: (res: any) => {
        this.metricas.categorias = res.dato ? res.dato.length : 0;
      },
      error: (err: any) => {
        console.error('Error cargando categorías:', err);
        this.metricas.categorias = 0;
      }
    });

    // Cargar usuarios
    this.usuarioService.list().subscribe({
      next: (res: any) => {
        this.metricas.usuarios = res.dato ? res.dato.length : 0;
      },
      error: (err: any) => {
        console.error('Error cargando usuarios:', err);
        this.metricas.usuarios = 0;
      }
    });

    // Cargar métodos de pago
    this.metodoPagoService.list().subscribe({
      next: (res: any) => {
        this.metricas.metodosPago = res.dato ? res.dato.length : 0;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error cargando métodos de pago:', err);
        this.metricas.metodosPago = 0;
        this.isLoading = false;
      }
    });
  }

}
