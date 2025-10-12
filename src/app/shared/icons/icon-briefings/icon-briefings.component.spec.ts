import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconBriefingsComponent } from './icon-briefings.component';

describe('IconBriefingsComponent', () => {
  let component: IconBriefingsComponent;
  let fixture: ComponentFixture<IconBriefingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconBriefingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconBriefingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
