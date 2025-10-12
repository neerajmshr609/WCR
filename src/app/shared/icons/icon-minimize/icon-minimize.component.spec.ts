import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconMinimizeComponent } from './icon-minimize.component';

describe('IconMinimizeComponent', () => {
  let component: IconMinimizeComponent;
  let fixture: ComponentFixture<IconMinimizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconMinimizeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconMinimizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
