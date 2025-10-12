import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationManagePanelComponent } from './conversation-manage-panel.component';

describe('ConversationManagePanelComponent', () => {
  let component: ConversationManagePanelComponent;
  let fixture: ComponentFixture<ConversationManagePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationManagePanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationManagePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
