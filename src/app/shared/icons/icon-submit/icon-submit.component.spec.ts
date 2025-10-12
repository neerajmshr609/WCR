import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSubmitComponent } from './icon-submit.component';

describe('IconSubmitComponent', () => {
  let component: IconSubmitComponent;
  let fixture: ComponentFixture<IconSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSubmitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
