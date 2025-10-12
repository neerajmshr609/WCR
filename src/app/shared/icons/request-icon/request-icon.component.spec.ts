import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestIconComponent } from './request-icon.component';

describe('RequestIconComponent', () => {
  let component: RequestIconComponent;
  let fixture: ComponentFixture<RequestIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
