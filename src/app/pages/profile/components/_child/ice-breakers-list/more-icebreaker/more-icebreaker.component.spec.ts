import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreIcebreakerComponent } from './more-icebreaker.component';

describe('MoreIcebreakerComponent', () => {
  let component: MoreIcebreakerComponent;
  let fixture: ComponentFixture<MoreIcebreakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreIcebreakerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoreIcebreakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
