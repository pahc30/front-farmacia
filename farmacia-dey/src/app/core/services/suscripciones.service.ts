import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SuscripcionesService {
  private loginSource = new Subject<void>();
  loginObservable$ = this.loginSource.asObservable();
  constructor() { }

  triggerLogin() {
    this.loginSource.next();
  }
}
