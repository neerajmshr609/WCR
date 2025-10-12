import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCapsuleModaleComponent } from './create-capsule-modal.component';

describe('CreateCapsuleModaleComponent', () => {
  let component: CreateCapsuleModaleComponent;
  let fixture: ComponentFixture<CreateCapsuleModaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCapsuleModaleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCapsuleModaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
