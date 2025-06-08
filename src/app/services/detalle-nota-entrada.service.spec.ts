import { TestBed } from '@angular/core/testing';

import { DetalleNotaEntradaService } from './detalle-nota-entrada.service';

describe('DetalleNotaEntradaService', () => {
  let service: DetalleNotaEntradaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleNotaEntradaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
