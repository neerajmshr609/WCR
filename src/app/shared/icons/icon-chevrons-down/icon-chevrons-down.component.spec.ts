import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconChevronsDownComponent } from './icon-chevrons-down.component';

describe('IconChevronsDownComponent', () => {
  let component: IconChevronsDownComponent;
  let fixture: ComponentFixture<IconChevronsDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconChevronsDownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconChevronsDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
