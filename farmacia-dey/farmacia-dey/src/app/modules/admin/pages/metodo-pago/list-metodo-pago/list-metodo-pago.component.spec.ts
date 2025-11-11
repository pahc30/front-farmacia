import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMetodoPagoComponent } from './list-metodo-pago.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

describe('ListMetodoPagoComponent', () => {
	let component: ListMetodoPagoComponent;
	let fixture: ComponentFixture<ListMetodoPagoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [ListMetodoPagoComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListMetodoPagoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});