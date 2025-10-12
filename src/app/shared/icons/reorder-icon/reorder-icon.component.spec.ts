import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReorderIconComponent } from './reorder-icon.component';

describe('ReorderIconComponent', () => {
  let component: ReorderIconComponent;
  let fixture: ComponentFixture<ReorderIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReorderIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReorderIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
