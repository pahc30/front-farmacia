import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideMenuClientComponent } from './side-menu-client.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

describe('SideMenuClientComponent', () => {
	let component: SideMenuClientComponent;
	let fixture: ComponentFixture<SideMenuClientComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconModule],
			declarations: [SideMenuClientComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SideMenuClientComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
