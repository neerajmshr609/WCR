import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendsIconComponent } from './trends-icon.component';

describe('TrendsIconComponent', () => {
  let component: TrendsIconComponent;
  let fixture: ComponentFixture<TrendsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrendsIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrendsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
