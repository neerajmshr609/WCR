import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconStopComponent } from './icon-stop.component';

describe('IconStopComponent', () => {
  let component: IconStopComponent;
  let fixture: ComponentFixture<IconStopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconStopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
