import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompraComponent } from './compra.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

describe('CompraComponent', () => {
	let component: CompraComponent;
	let fixture: ComponentFixture<CompraComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CompraComponent],
			imports: [HttpClientModule],
			providers: [
				{ provide: MatDialogRef, useValue: {} }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CompraComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});