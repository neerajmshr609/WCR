import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PqaCardComponent } from './pqa-card.component';

describe('PqaCardComponent', () => {
  let component: PqaCardComponent;
  let fixture: ComponentFixture<PqaCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PqaCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PqaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
