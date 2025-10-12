import { TestBed } from '@angular/core/testing';

import { WeblinksService } from './weblinks.service';

describe('WeblinksService', () => {
  let service: WeblinksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeblinksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
