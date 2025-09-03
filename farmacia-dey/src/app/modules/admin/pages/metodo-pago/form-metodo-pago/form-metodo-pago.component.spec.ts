import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMetodoPagoComponent } from './form-metodo-pago.component';

describe('FormMetodoPagoComponent', () => {
  let component: FormMetodoPagoComponent;
  let fixture: ComponentFixture<FormMetodoPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormMetodoPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMetodoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
