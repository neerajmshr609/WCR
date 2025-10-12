import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParentcategoriesComponent } from './parentcategories.component';

describe('ParentcategoriesComponent', () => {
  let component: ParentcategoriesComponent;
  let fixture: ComponentFixture<ParentcategoriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ParentcategoriesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
