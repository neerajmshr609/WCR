import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconInfoComponent } from './icon-info.component';

describe('IconInfoComponent', () => {
  let component: IconInfoComponent;
  let fixture: ComponentFixture<IconInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
