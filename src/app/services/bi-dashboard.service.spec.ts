import { TestBed } from '@angular/core/testing';

import { BiDashboardService } from './bi-dashboard.service';

describe('BiDashboardService', () => {
  let service: BiDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
