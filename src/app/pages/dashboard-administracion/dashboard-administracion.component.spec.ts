import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdministracionComponent } from './dashboard-administracion.component';

describe('DashboardAdministracionComponent', () => {
  let component: DashboardAdministracionComponent;
  let fixture: ComponentFixture<DashboardAdministracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdministracionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardAdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
