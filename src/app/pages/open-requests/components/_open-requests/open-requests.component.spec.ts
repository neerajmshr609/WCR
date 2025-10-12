import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRequestsComponent } from './open-requests.component';

describe('OpenRequestComponent', () => {
  let component: OpenRequestsComponent;
  let fixture: ComponentFixture<OpenRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenRequestsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
