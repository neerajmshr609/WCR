import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeAnimationComponent } from './maze-animation.component';

describe('MazeAnimationComponent', () => {
  let component: MazeAnimationComponent;
  let fixture: ComponentFixture<MazeAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MazeAnimationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
