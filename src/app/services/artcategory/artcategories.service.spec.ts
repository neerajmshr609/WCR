import { TestBed } from '@angular/core/testing';

import { ArtcategoriesService } from './artcategories.service';

describe('ArtcategoriesService', () => {
  let service: ArtcategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtcategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
