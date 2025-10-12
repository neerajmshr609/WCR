import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconFinishComponent } from './icon-finish.component';

describe('IconFinishComponent', () => {
  let component: IconFinishComponent;
  let fixture: ComponentFixture<IconFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconFinishComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
