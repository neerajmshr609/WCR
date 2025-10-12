import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveIconComponent } from './move-icon.component';

describe('MoveIconComponent', () => {
  let component: MoveIconComponent;
  let fixture: ComponentFixture<MoveIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoveIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
