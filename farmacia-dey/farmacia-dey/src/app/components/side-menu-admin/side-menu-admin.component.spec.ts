import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideMenuAdminComponent } from './side-menu-admin.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('SideMenuAdminComponent', () => {
  let component: SideMenuAdminComponent;
  let fixture: ComponentFixture<SideMenuAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideMenuAdminComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});