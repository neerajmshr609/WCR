import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersListHorizontalComponent } from './filters-list-horizontal.component';

describe('FiltersListHorizontalComponent', () => {
  let component: FiltersListHorizontalComponent;
  let fixture: ComponentFixture<FiltersListHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FiltersListHorizontalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersListHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
