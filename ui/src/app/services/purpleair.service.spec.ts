import { TestBed } from '@angular/core/testing';

import { PurpleairService } from './purpleair.service';

describe('PurpleairService', () => {
  let service: PurpleairService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurpleairService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
