import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationsIconComponent } from './conversations-icon.component';

describe('ConversationsIconComponent', () => {
  let component: ConversationsIconComponent;
  let fixture: ComponentFixture<ConversationsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationsIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
