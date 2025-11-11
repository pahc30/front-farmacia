import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormUsuarioComponent } from './form-usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

describe('FormUsuarioComponent', () => {
	let component: FormUsuarioComponent;
	let fixture: ComponentFixture<FormUsuarioComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [FormUsuarioComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormUsuarioComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});