import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileConversationDetailsComponent } from './mobile-conversation-details.component';

describe('MobileConversationDetailsComponent', () => {
  let component: MobileConversationDetailsComponent;
  let fixture: ComponentFixture<MobileConversationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MobileConversationDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileConversationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
