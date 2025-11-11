import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormMetodoPagoComponent } from './form-metodo-pago.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

describe('FormMetodoPagoComponent', () => {
	let component: FormMetodoPagoComponent;
	let fixture: ComponentFixture<FormMetodoPagoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [FormMetodoPagoComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormMetodoPagoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});