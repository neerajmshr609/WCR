import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconAnchorComponent } from './icon-anchor.component';

describe('IconAnchorComponent', () => {
  let component: IconAnchorComponent;
  let fixture: ComponentFixture<IconAnchorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconAnchorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconAnchorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
