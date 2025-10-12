import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationRowComponent } from './conversation-row.component';

describe('ConversationRowComponent', () => {
  let component: ConversationRowComponent;
  let fixture: ComponentFixture<ConversationRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
