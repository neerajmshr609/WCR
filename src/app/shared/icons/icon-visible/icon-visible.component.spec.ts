import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconVisibleComponent } from './icon-visible.component';

describe('IconVisibleComponent', () => {
  let component: IconVisibleComponent;
  let fixture: ComponentFixture<IconVisibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconVisibleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconVisibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
