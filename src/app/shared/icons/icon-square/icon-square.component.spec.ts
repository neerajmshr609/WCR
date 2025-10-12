import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSquareComponent } from './icon-square.component';

describe('IconSquareComponent', () => {
  let component: IconSquareComponent;
  let fixture: ComponentFixture<IconSquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSquareComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
