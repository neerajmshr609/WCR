import { TestBed } from '@angular/core/testing';

import { ProfileImageUploaderService } from './profile-image-uploader.service';

describe('ProfileImageUploaderService', () => {
  let service: ProfileImageUploaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileImageUploaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
