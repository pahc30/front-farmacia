import { Component, OnInit } from '@angular/core';
import { AuthJWTService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [MatIconModule, MatMenuModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent implements OnInit {

  infoUsuario: any = null;

  constructor(private authService: AuthJWTService) {}
  ngOnInit(): void {
    this.loadInfoUsuario();
  }

  loadInfoUsuario(): void {
    this.infoUsuario = this.authService.getInfoUsuario();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
