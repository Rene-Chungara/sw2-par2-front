import { TestBed } from '@angular/core/testing';

import { RolpermisoService } from './rolpermiso.service';

describe('RolpermisoService', () => {
  let service: RolpermisoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolpermisoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
