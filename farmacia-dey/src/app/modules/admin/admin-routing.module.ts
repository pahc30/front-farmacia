import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ListUsuarioComponent } from './pages/usuario/list-usuario/list-usuario.component';
import { FormUsuarioComponent } from './pages/usuario/form-usuario/form-usuario.component';
import { FormMetodoPagoComponent } from './pages/metodo-pago/form-metodo-pago/form-metodo-pago.component';
import { ListMetodoPagoComponent } from './pages/metodo-pago/list-metodo-pago/list-metodo-pago.component';
import { FormCategoriaComponent } from './pages/categoria/form-categoria/form-categoria.component';
import { ListCategoriaComponent } from './pages/categoria/list-categoria/list-categoria.component';
import { FormProductoComponent } from './pages/producto/form-producto/form-producto.component';
import { ListProductoComponent } from './pages/producto/list-producto/list-producto.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'usuario', component: ListUsuarioComponent },
      { path: 'usuario/add', component: FormUsuarioComponent },
      { path: 'usuario/edit/:id', component: FormUsuarioComponent },

      { path: 'metodo-pago', component: ListMetodoPagoComponent },
      { path: 'metodo-pago/add', component: FormMetodoPagoComponent },
      { path: 'metodo-pago/edit/:id', component: FormMetodoPagoComponent },

      { path: 'categoria', component: ListCategoriaComponent },
      { path: 'categoria/add', component: FormCategoriaComponent },
      { path: 'categoria/edit/:id', component: FormCategoriaComponent },

      { path: 'producto', component: ListProductoComponent },
      { path: 'producto/add', component: FormProductoComponent },
      { path: 'producto/edit/:id', component: FormProductoComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
