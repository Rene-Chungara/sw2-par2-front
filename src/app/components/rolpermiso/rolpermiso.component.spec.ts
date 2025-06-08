import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolpermisoComponent } from './rolpermiso.component';

describe('RolpermisoComponent', () => {
  let component: RolpermisoComponent;
  let fixture: ComponentFixture<RolpermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolpermisoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RolpermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
