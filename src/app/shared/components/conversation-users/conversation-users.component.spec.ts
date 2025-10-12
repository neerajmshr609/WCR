import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationUsersComponent } from './conversation-users.component';

describe('GroupConversationInfoComponent', () => {
  let component: ConversationUsersComponent;
  let fixture: ComponentFixture<ConversationUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
