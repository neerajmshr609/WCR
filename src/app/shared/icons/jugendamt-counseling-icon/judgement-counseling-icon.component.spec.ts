import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgementCounselingIconComponent } from './judgement-counseling-icon.component';

describe('JugendamtCounselingIconComponent', () => {
  let component: JudgementCounselingIconComponent;
  let fixture: ComponentFixture<JudgementCounselingIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JudgementCounselingIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JudgementCounselingIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
