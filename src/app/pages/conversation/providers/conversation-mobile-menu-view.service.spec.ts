import { TestBed } from '@angular/core/testing';

import { ConversationMobileMenuViewService } from './conversation-mobile-menu-view.service';

describe('ConversationMobileMenuViewService', () => {
  let service: ConversationMobileMenuViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversationMobileMenuViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
