import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyConversationsComponent } from './empty-conversations.component';

describe('EmptyConversationsComponent', () => {
  let component: EmptyConversationsComponent;
  let fixture: ComponentFixture<EmptyConversationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptyConversationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyConversationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
