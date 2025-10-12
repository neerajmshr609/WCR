import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSupportIconComponent } from './get-support-icon.component';

describe('GetSupportIconComponent', () => {
  let component: GetSupportIconComponent;
  let fixture: ComponentFixture<GetSupportIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GetSupportIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GetSupportIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
