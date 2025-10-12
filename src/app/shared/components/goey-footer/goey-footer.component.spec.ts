import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoeyFooterComponent } from './goey-footer.component';

describe('GoeyFooterComponent', () => {
  let component: GoeyFooterComponent;
  let fixture: ComponentFixture<GoeyFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoeyFooterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoeyFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
