import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAdvisorModalComponent } from './become-advisor-modal.component';

describe('BecomeAdvisorModalComponent', () => {
  let component: BecomeAdvisorModalComponent;
  let fixture: ComponentFixture<BecomeAdvisorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BecomeAdvisorModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeAdvisorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
