import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagsOrderComponent } from './tags-order.component';

describe('TagsOrderComponent', () => {
  let component: TagsOrderComponent;
  let fixture: ComponentFixture<TagsOrderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TagsOrderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
