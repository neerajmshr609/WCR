import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingCardComponent } from './typing-card.component';

describe('TypingCardComponent', () => {
  let component: TypingCardComponent;
  let fixture: ComponentFixture<TypingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypingCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TypingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
