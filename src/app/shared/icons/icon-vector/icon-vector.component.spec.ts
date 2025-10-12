import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconVectorComponent } from './icon-vector.component';

describe('IconVectorComponent', () => {
  let component: IconVectorComponent;
  let fixture: ComponentFixture<IconVectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconVectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconVectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
