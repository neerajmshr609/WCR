import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconBriefComponent } from './icon-brief.component';

describe('AppIconBriefComponent', () => {
  let component: IconBriefComponent;
  let fixture: ComponentFixture<IconBriefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconBriefComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
