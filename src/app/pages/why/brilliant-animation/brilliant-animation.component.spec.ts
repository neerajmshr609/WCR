import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrilliantAnimationComponent } from './brilliant-animation.component';

describe('BrilliantAnimationComponent', () => {
  let component: BrilliantAnimationComponent;
  let fixture: ComponentFixture<BrilliantAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrilliantAnimationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrilliantAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
