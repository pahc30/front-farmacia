import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListProductoComponent } from './list-producto.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

describe('ListProductoComponent', () => {
	let component: ListProductoComponent;
	let fixture: ComponentFixture<ListProductoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [ListProductoComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListProductoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});