import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { HomeComponent } from './pages/home/home.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { CompraComponent } from './pages/compra/compra.component';
import { PagoComponent } from './pages/pago/pago.component';
import { PagoExitosoComponent } from './pages/pago-exitoso/pago-exitoso.component';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'tienda', component: HomeComponent }, // Alias para tienda
      { path: 'carrito', component: CarritoComponent },
      { path: 'pago', component: PagoComponent },
      { path: 'pago-exitoso', component: PagoExitosoComponent },
      { path: 'compras', component: CompraComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}