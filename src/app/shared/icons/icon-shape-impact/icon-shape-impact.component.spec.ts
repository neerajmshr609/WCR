import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconShapeImpactComponent } from './icon-shape-impact.component';

describe('IconShapeImpactComponent', () => {
  let component: IconShapeImpactComponent;
  let fixture: ComponentFixture<IconShapeImpactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconShapeImpactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconShapeImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
