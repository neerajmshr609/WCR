import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransactionsIdeasComponent } from './transactions-ideas.component';

describe('TransactionsIdeasComponent', () => {
  let component: TransactionsIdeasComponent;
  let fixture: ComponentFixture<TransactionsIdeasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionsIdeasComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsIdeasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
