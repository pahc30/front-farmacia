import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuAdminComponent } from './side-menu-admin.component';

describe('SideMenuAdminComponent', () => {
  let component: SideMenuAdminComponent;
  let fixture: ComponentFixture<SideMenuAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideMenuAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideMenuAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
