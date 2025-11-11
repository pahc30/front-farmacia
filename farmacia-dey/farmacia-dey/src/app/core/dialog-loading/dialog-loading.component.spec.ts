import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogLoadingComponent } from './dialog-loading.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('DialogLoadingComponent', () => {
	let component: DialogLoadingComponent;
	let fixture: ComponentFixture<DialogLoadingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DialogLoadingComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DialogLoadingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});