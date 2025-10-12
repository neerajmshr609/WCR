import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRequestCardComponent } from './open-request-card.component';

describe('OpenRequestCardComponent', () => {
  let component: OpenRequestCardComponent;
  let fixture: ComponentFixture<OpenRequestCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenRequestCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
