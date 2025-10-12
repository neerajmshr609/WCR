import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectInfoCardSingleComponent } from './project-info-card-single.component';

describe('ProjectInfoCardSingleComponent', () => {
  let component: ProjectInfoCardSingleComponent;
  let fixture: ComponentFixture<ProjectInfoCardSingleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectInfoCardSingleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInfoCardSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
