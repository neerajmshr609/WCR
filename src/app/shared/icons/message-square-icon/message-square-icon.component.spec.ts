import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSquareIconComponent } from './message-square-icon.component';

describe('MessageSquareIconComponent', () => {
  let component: MessageSquareIconComponent;
  let fixture: ComponentFixture<MessageSquareIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageSquareIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageSquareIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
