import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileConversationComponent } from './mobile-conversation.component';

describe('MobileConversationComponent', () => {
  let component: MobileConversationComponent;
  let fixture: ComponentFixture<MobileConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileConversationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
