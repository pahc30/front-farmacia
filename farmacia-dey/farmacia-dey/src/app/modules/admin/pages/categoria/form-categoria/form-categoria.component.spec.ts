import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCategoriaComponent } from './form-categoria.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

describe('FormCategoriaComponent', () => {
	let component: FormCategoriaComponent;
	let fixture: ComponentFixture<FormCategoriaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [FormCategoriaComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormCategoriaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});