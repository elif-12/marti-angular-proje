import { TestBed } from '@angular/core/testing';

import { Distance } from './distance';

describe('Distance', () => {
  let service: Distance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Distance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
