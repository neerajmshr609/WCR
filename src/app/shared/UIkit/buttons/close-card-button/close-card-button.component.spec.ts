import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseCardButtonComponent } from './close-card-button.component';

describe('CloseCardButtonComponent', () => {
  let component: CloseCardButtonComponent;
  let fixture: ComponentFixture<CloseCardButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseCardButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CloseCardButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
