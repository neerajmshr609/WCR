import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogIconComponent } from './blog-icon.component';

describe('BlogIconComponent', () => {
  let component: BlogIconComponent;
  let fixture: ComponentFixture<BlogIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
