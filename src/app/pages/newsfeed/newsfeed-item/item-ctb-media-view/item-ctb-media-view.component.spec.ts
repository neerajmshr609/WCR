import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemCtbMediaViewComponent } from './item-ctb-media-view.component';

describe('ItemCtbMediaViewComponent', () => {
  let component: ItemCtbMediaViewComponent;
  let fixture: ComponentFixture<ItemCtbMediaViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ItemCtbMediaViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCtbMediaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
