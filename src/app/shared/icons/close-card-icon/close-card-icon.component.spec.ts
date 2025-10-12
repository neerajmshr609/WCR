import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseCardIconComponent } from './close-card-icon.component';

describe('CloseIconComponent', () => {
  let component: CloseCardIconComponent;
  let fixture: ComponentFixture<CloseCardIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseCardIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CloseCardIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
