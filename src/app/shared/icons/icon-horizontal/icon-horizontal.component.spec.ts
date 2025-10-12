import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHorizontalComponent } from './icon-horizontal.component';

describe('IconHorizontalComponent', () => {
  let component: IconHorizontalComponent;
  let fixture: ComponentFixture<IconHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHorizontalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
