import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNotaEntradaComponent } from './crear-nota-entrada.component';

describe('CrearNotaEntradaComponent', () => {
  let component: CrearNotaEntradaComponent;
  let fixture: ComponentFixture<CrearNotaEntradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearNotaEntradaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearNotaEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
