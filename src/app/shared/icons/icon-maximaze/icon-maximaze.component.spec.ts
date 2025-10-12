import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconMaximazeComponent } from './icon-maximaze.component';

describe('IconMaximazeComponent', () => {
  let component: IconMaximazeComponent;
  let fixture: ComponentFixture<IconMaximazeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconMaximazeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconMaximazeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
