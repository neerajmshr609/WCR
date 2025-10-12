import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsOnlineComponent } from './is-online.component';

describe('IsOnlineComponent', () => {
  let component: IsOnlineComponent;
  let fixture: ComponentFixture<IsOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IsOnlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
