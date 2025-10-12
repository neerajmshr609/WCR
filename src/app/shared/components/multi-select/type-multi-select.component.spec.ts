import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeMultiSelectComponent } from './type-multi-select.component';

describe('MultySelectComponent', () => {
  let component: TypeMultiSelectComponent;
  let fixture: ComponentFixture<TypeMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeMultiSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TypeMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
