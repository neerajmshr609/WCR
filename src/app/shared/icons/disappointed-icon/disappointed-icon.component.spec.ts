import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisappointedIconComponent } from './disappointed-icon.component';

describe('DolarIconComponent', () => {
  let component: DisappointedIconComponent;
  let fixture: ComponentFixture<DisappointedIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisappointedIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisappointedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
