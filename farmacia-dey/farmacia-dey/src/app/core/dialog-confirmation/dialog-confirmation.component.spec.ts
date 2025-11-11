import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogConfirmationComponent } from './dialog-confirmation.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('DialogConfirmationComponent', () => {
	let component: DialogConfirmationComponent;
	let fixture: ComponentFixture<DialogConfirmationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DialogConfirmationComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DialogConfirmationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});