import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowUpIconComponent } from './arrow-up-icon.component';

describe('DolarIconComponent', () => {
  let component: ArrowUpIconComponent;
  let fixture: ComponentFixture<ArrowUpIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowUpIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArrowUpIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
