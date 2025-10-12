import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinIconComponent } from './linkedin-icon.component';

describe('DolarIconComponent', () => {
  let component: LinkedinIconComponent;
  let fixture: ComponentFixture<LinkedinIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedinIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedinIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
