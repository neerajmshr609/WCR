import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationMenuItemComponent } from './conversation-menu-item.component';

describe('ConversationMenuItemComponent', () => {
  let component: ConversationMenuItemComponent;
  let fixture: ComponentFixture<ConversationMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationMenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
