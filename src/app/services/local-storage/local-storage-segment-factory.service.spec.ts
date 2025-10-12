import { TestBed } from '@angular/core/testing';

import { LocalStorageSegmentFactoryService } from './local-storage-segment-factory.service';

describe('LocalStorageSegmentFactoryService', () => {
  let service: LocalStorageSegmentFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageSegmentFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
