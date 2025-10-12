import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimizedInvitationPageComponent } from './minimized-invitation-page.component';

describe('MinimizedInvitationPageComponent', () => {
  let component: MinimizedInvitationPageComponent;
  let fixture: ComponentFixture<MinimizedInvitationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MinimizedInvitationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinimizedInvitationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
