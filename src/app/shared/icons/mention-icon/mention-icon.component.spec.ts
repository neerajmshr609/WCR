import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionIconComponent } from './mention-icon.component';

describe('MentionIconComponent', () => {
  let component: MentionIconComponent;
  let fixture: ComponentFixture<MentionIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MentionIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MentionIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
