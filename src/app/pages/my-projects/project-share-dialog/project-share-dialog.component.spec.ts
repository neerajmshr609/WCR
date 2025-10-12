import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectShareDialogComponent } from './project-share-dialog.component';

describe('ProjectShareDialogComponent', () => {
  let component: ProjectShareDialogComponent;
  let fixture: ComponentFixture<ProjectShareDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectShareDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectShareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
