import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorIntlEsp } from '../../core/paginator/mat-paginator-int-esp.class';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SideMenuAdminComponent } from '../../components/side-menu-admin/side-menu-admin.component';
import { AdminComponent } from './admin.component';
import { MatMenuModule } from '@angular/material/menu';
import { ListUsuarioComponent } from './pages/usuario/list-usuario/list-usuario.component';
import { FormUsuarioComponent } from './pages/usuario/form-usuario/form-usuario.component';
import { FormMetodoPagoComponent } from './pages/metodo-pago/form-metodo-pago/form-metodo-pago.component';
import { ListMetodoPagoComponent } from './pages/metodo-pago/list-metodo-pago/list-metodo-pago.component';
import { ListCategoriaComponent } from './pages/categoria/list-categoria/list-categoria.component';
import { FormCategoriaComponent } from './pages/categoria/form-categoria/form-categoria.component';
import { FormProductoComponent } from './pages/producto/form-producto/form-producto.component';
import { ListProductoComponent } from './pages/producto/list-producto/list-producto.component';
@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    SideMenuAdminComponent,
    ListUsuarioComponent,
    FormUsuarioComponent,
    FormMetodoPagoComponent,
    ListMetodoPagoComponent,
    ListCategoriaComponent,
    FormCategoriaComponent,
    FormProductoComponent,
    ListProductoComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButton,
    MatDividerModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatCardModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlEsp }
  ],
})
export class AdminModule { }
