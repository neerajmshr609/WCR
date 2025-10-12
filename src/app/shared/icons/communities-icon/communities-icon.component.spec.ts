import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitiesIconComponent } from './communities-icon.component';

describe('CommunitiesIconComponent', () => {
  let component: CommunitiesIconComponent;
  let fixture: ComponentFixture<CommunitiesIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunitiesIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunitiesIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
