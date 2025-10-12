import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationTypeComponent } from './conversation-type.component';

describe('ConversationTypeComponent', () => {
  let component: ConversationTypeComponent;
  let fixture: ComponentFixture<ConversationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
