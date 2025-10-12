import { TestBed } from '@angular/core/testing';

import { ConversationHeaderService } from './conversation-header.service';

describe('ConversationHeaderService', () => {
  let service: ConversationHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversationHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
