import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IceBreakersListComponent } from './ice-breakers-list.component';

describe('IceBreakersListComponent', () => {
  let component: IceBreakersListComponent;
  let fixture: ComponentFixture<IceBreakersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IceBreakersListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IceBreakersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
