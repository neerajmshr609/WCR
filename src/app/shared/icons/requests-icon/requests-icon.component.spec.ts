import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsIconComponent } from './requests-icon.component';

describe('RequestsIconComponent', () => {
  let component: RequestsIconComponent;
  let fixture: ComponentFixture<RequestsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestsIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
