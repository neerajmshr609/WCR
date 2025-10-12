import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownListItemComponent } from './dropdown-list-item.component';

describe('DropdownListItemComponent', () => {
  let component: DropdownListItemComponent;
  let fixture: ComponentFixture<DropdownListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
