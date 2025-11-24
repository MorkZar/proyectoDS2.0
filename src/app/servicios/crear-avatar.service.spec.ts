import { TestBed } from '@angular/core/testing';

import { CrearAvatarService } from './crear-avatar.service';

describe('CrearAvatarService', () => {
  let service: CrearAvatarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearAvatarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
