import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconRecommendedComponent } from './icon-recommended.component';

describe('IconRecommendedComponent', () => {
  let component: IconRecommendedComponent;
  let fixture: ComponentFixture<IconRecommendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconRecommendedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconRecommendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
