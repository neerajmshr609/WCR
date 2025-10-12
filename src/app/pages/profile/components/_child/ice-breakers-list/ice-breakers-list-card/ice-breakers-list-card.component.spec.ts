import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IceBreakersListCardComponent } from './ice-breakers-list-card.component';

describe('IceBreakersListCardComponent', () => {
  let component: IceBreakersListCardComponent;
  let fixture: ComponentFixture<IceBreakersListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IceBreakersListCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IceBreakersListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
