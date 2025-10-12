import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertiseTitleCardComponent } from './expertise-title-card.component';

describe('ExpertiseTitleCardComponent', () => {
  let component: ExpertiseTitleCardComponent;
  let fixture: ComponentFixture<ExpertiseTitleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpertiseTitleCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpertiseTitleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
