import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoCounterService {
  private countSubject = new BehaviorSubject<number>(0);
  public count$: Observable<number> = this.countSubject.asObservable();

  constructor() { }

  // Actualizar el contador
  updateCount(count: number): void {
    this.countSubject.next(count);
  }

  // Incrementar el contador
  incrementCount(): void {
    const currentCount = this.countSubject.value;
    this.countSubject.next(currentCount + 1);
  }

  // Obtener el valor actual
  getCurrentCount(): number {
    return this.countSubject.value;
  }

  // Resetear el contador
  resetCount(): void {
    this.countSubject.next(0);
  }
}