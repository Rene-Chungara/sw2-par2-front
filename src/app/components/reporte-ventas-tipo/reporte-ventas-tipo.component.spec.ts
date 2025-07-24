import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVentasTipoComponent } from './reporte-ventas-tipo.component';

describe('ReporteVentasTipoComponent', () => {
  let component: ReporteVentasTipoComponent;
  let fixture: ComponentFixture<ReporteVentasTipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteVentasTipoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteVentasTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
