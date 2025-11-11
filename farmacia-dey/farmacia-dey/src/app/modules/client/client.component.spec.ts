import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientComponent } from './client.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

describe('ClientComponent', () => {
	let component: ClientComponent;
	let fixture: ComponentFixture<ClientComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ClientComponent],
			imports: [HttpClientModule],
			providers: [
				{ provide: MatDialogRef, useValue: {} }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ClientComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});