import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillIconComponent } from './pill-icon.component';

describe('PillIconComponent', () => {
  let component: PillIconComponent;
  let fixture: ComponentFixture<PillIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PillIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
