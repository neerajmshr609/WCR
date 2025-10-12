import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoXIconComponent } from './no-x-icon.component';

describe('FileIconComponent', () => {
  let component: NoXIconComponent;
  let fixture: ComponentFixture<NoXIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoXIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoXIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
