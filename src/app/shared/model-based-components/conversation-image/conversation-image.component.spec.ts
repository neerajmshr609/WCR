import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationImageComponent } from './conversation-image.component';

describe('ConversationImageComponent', () => {
  let component: ConversationImageComponent;
  let fixture: ComponentFixture<ConversationImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
