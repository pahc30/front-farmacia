import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogOverviewComponent } from './dialog-overview.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('DialogOverviewComponent', () => {
	let component: DialogOverviewComponent;
	let fixture: ComponentFixture<DialogOverviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DialogOverviewComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DialogOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});