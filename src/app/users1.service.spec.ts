import { TestBed } from '@angular/core/testing';

import { Users1Service } from './users1.service';

describe('Users1Service', () => {
  let service: Users1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Users1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
