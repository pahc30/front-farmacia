import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMetodoPagoComponent } from './list-metodo-pago.component';

describe('ListMetodoPagoComponent', () => {
  let component: ListMetodoPagoComponent;
  let fixture: ComponentFixture<ListMetodoPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListMetodoPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMetodoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
