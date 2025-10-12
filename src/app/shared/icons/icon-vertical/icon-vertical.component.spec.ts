import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconVerticalComponent } from './icon-vertical.component';

describe('IconVerticalComponent', () => {
  let component: IconVerticalComponent;
  let fixture: ComponentFixture<IconVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconVerticalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
