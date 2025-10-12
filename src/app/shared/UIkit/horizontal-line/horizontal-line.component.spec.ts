import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalLineComponent } from './horizontal-line.component';

describe('HorizontalLineComponent', () => {
  let component: HorizontalLineComponent;
  let fixture: ComponentFixture<HorizontalLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HorizontalLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
