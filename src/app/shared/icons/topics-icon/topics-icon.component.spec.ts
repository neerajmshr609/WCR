import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsIconComponent } from './topics-icon.component';

describe('TopicsIconComponent', () => {
  let component: TopicsIconComponent;
  let fixture: ComponentFixture<TopicsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicsIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
