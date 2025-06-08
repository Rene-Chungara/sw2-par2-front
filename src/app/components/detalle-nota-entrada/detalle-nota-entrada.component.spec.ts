import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleNotaEntradaComponent } from './detalle-nota-entrada.component';

describe('DetalleNotaEntradaComponent', () => {
  let component: DetalleNotaEntradaComponent;
  let fixture: ComponentFixture<DetalleNotaEntradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleNotaEntradaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleNotaEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
