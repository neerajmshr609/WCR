import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationFilterItemComponent } from './conversation-filter-item.component';

describe('FilterItemComponent', () => {
  let component: ConversationFilterItemComponent;
  let fixture: ComponentFixture<ConversationFilterItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationFilterItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationFilterItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
