import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonMoreVertComponent } from './button-more-vert.component';

describe('ButtonMoreVertComponent', () => {
  let component: ButtonMoreVertComponent;
  let fixture: ComponentFixture<ButtonMoreVertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonMoreVertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonMoreVertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
