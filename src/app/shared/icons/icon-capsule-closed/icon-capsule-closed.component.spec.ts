import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCapsuleClosedComponent } from './icon-capsule-closed.component';

describe('IconCapsuleClosedComponent', () => {
  let component: IconCapsuleClosedComponent;
  let fixture: ComponentFixture<IconCapsuleClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconCapsuleClosedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconCapsuleClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
