import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCategoriaComponent } from './list-categoria.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

describe('ListCategoriaComponent', () => {
	let component: ListCategoriaComponent;
	let fixture: ComponentFixture<ListCategoriaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [ListCategoriaComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListCategoriaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});