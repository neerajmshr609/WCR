import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayCircleIconComponent } from './play-circle-icon.component';

describe('DolarIconComponent', () => {
  let component: PlayCircleIconComponent;
  let fixture: ComponentFixture<PlayCircleIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayCircleIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayCircleIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
