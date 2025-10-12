import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArtCategoriesComponent } from './art-categories.component';

describe('ArtCategoriesComponent', () => {
  let component: ArtCategoriesComponent;
  let fixture: ComponentFixture<ArtCategoriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ArtCategoriesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
