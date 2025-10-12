import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransactionsCapComponent } from './transactions-cap.component';

describe('TransactionsCapComponent', () => {
  let component: TransactionsCapComponent;
  let fixture: ComponentFixture<TransactionsCapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionsCapComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsCapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
