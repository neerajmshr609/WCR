import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationMenuComponent } from './conversation-menu.component';

describe('ConversationMenuComponent', () => {
  let component: ConversationMenuComponent;
  let fixture: ComponentFixture<ConversationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
