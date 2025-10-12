import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AimedHeartIconComponent } from './aimed-heart-icon.component';

describe('AimedHeartIconComponent', () => {
  let component: AimedHeartIconComponent;
  let fixture: ComponentFixture<AimedHeartIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AimedHeartIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AimedHeartIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
