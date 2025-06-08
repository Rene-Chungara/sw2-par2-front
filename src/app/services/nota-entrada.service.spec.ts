import { TestBed } from '@angular/core/testing';

import { NotaEntradaService } from './nota-entrada.service';

describe('NotaEntradaService', () => {
  let service: NotaEntradaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotaEntradaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
