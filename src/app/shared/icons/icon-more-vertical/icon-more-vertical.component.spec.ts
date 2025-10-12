import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreVerticalComponent } from './more-vertical.component';

describe('MoreVerticalComponent', () => {
  let component: MoreVerticalComponent;
  let fixture: ComponentFixture<MoreVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreVerticalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoreVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
