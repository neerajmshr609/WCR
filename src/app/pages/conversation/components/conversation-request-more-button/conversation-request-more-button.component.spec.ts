import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationRequestMoreButtonComponent } from './conversation-request-more-button.component';

describe('ConversationRequestMoreButtonComponent', () => {
  let component: ConversationRequestMoreButtonComponent;
  let fixture: ComponentFixture<ConversationRequestMoreButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationRequestMoreButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationRequestMoreButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
