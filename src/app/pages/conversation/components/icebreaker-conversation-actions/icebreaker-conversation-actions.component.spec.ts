import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcebreakerConversationActionsComponent } from './icebreaker-conversation-actions.component';

describe('IcebreakerConversationActionsComponent', () => {
  let component: IcebreakerConversationActionsComponent;
  let fixture: ComponentFixture<IcebreakerConversationActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcebreakerConversationActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcebreakerConversationActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
