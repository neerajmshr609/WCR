import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationConfirmationComponent } from './invitation-confirmation.component';

describe('InvitationConfirmationComponent', () => {
  let component: InvitationConfirmationComponent;
  let fixture: ComponentFixture<InvitationConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
