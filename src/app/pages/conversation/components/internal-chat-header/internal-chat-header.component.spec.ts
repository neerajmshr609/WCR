import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalChatHeaderComponent } from './internal-chat-header.component';

describe('InternalChatHeaderComponent', () => {
  let component: InternalChatHeaderComponent;
  let fixture: ComponentFixture<InternalChatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternalChatHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InternalChatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
