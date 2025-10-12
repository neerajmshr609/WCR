import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemMediaViewComponent } from './item-media-view.component';

describe('ItemMediaViewComponent', () => {
  let component: ItemMediaViewComponent;
  let fixture: ComponentFixture<ItemMediaViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ItemMediaViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMediaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
