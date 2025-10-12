import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconPullRequestComponent } from './icon-pull-request.component';

describe('IconPullRequestComponent', () => {
  let component: IconPullRequestComponent;
  let fixture: ComponentFixture<IconPullRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconPullRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconPullRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
