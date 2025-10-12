import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WhycardComponent } from './whycard.component';

describe('WhycardComponent', () => {
  let component: WhycardComponent;
  let fixture: ComponentFixture<WhycardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WhycardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhycardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
