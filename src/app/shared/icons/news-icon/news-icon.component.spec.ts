import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsIconComponent } from './news-icon.component';

describe('NewsIconComponent', () => {
  let component: NewsIconComponent;
  let fixture: ComponentFixture<NewsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
