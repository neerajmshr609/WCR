import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteFlagIconComponent } from './complete-flag-icon.component';

describe('FileIconComponent', () => {
  let component: CompleteFlagIconComponent;
  let fixture: ComponentFixture<CompleteFlagIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteFlagIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteFlagIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
