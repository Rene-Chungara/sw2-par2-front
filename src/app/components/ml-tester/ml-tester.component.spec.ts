import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlTesterComponent } from './ml-tester.component';

describe('MlTesterComponent', () => {
  let component: MlTesterComponent;
  let fixture: ComponentFixture<MlTesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MlTesterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MlTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
