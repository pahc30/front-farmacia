import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuClientComponent } from './side-menu-client.component';

describe('SideMenuClientComponent', () => {
  let component: SideMenuClientComponent;
  let fixture: ComponentFixture<SideMenuClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideMenuClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideMenuClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
