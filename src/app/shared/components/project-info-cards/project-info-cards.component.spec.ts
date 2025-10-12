import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectInfoCardsComponent } from './project-info-cards.component';

describe('ProjectInfoCardsComponent', () => {
  let component: ProjectInfoCardsComponent;
  let fixture: ComponentFixture<ProjectInfoCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectInfoCardsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInfoCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
