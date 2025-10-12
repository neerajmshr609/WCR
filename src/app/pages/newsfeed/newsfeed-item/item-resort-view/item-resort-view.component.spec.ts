import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemResortViewComponent } from './item-resort-view.component';

describe('ItemResortViewComponent', () => {
  let component: ItemResortViewComponent;
  let fixture: ComponentFixture<ItemResortViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ItemResortViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemResortViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
