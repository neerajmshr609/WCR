import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtitleCardComponent } from './subtitle-card.component';

describe('SubtitleCardComponent', () => {
  let component: SubtitleCardComponent;
  let fixture: ComponentFixture<SubtitleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubtitleCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtitleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
