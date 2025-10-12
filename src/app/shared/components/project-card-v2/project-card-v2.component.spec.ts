import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectCardV2Component } from './project-card-v2.component';

describe('ProjectCardV2Component', () => {
  let component: ProjectCardV2Component;
  let fixture: ComponentFixture<ProjectCardV2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectCardV2Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
