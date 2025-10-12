import { TestBed } from '@angular/core/testing';

import { UserProfileSkillsService } from './user-profile-skills.service';

describe('UserProfileSkillsService', () => {
  let service: UserProfileSkillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProfileSkillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
