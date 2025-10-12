import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenHeartIconComponent } from './open-heart-icon.component';

describe('OpenHeartIconComponent', () => {
  let component: OpenHeartIconComponent;
  let fixture: ComponentFixture<OpenHeartIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenHeartIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenHeartIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
