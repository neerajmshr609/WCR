import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsItemComponent } from './chips-item.component';

describe('ChipsItemComponent', () => {
  let component: ChipsItemComponent;
  let fixture: ComponentFixture<ChipsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChipsItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
