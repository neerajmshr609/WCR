import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatConfirmationPanelComponent } from './chat-confirmation-panel.component';

describe('ChatConfirmationPanelComponent', () => {
  let component: ChatConfirmationPanelComponent;
  let fixture: ComponentFixture<ChatConfirmationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatConfirmationPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatConfirmationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
