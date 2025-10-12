import { TestBed } from '@angular/core/testing';

import { OpenRequestsService } from './open-requests.service';

describe('OpenRequestsService', () => {
  let service: OpenRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
