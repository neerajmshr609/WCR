import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Decimal } from 'decimal.js';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { PaymentRequestBySeconds } from '../../models/payment-request';
import { PaymentSessionStatuses } from '../../enums';

const GREYT_PERCENT = 0.3;
const STRIPE_PERCENT = 0.029;
const STRIPE_TAX = 0.3;

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptComponent implements OnInit {
  @Input() link: string;
  @Input() outgoing: boolean;
  @Input() isFeedbackSession: boolean;
  @Input() hourlyRate: number;
  @Input() id: number;
  @Input() paymentRequest: PaymentRequestBySeconds;
  @Input() approved: boolean;
  @Input() denied: boolean;
  @Input() created: boolean;
  @Input() awaitingPayment: boolean;
  @Input() showDateCreated = true;
  @Input() showTime = true;
  @Input() showAdditions = true;
  @Input() isTips = false;
  @Input() peopleAmount: number;
  @Input() tipsValue: number;
  @Input() createdAt: string;
  @Input() type: string;
  @Input() processing$: Observable<{ processing: boolean; id: number }>;
  @Input() incomeText = 'Connector income';
  @Input() receiptTitle: string;
  @Output() denySessionPayment = new EventEmitter<number>();
  @Output() approveSessionPayment = new EventEmitter();

  showSpinner$: Observable<boolean>;

  public get isFree(): boolean {
    return (
      !this.paymentRequest?.billable_seconds &&
      !this.paymentRequest?.due_seconds &&
      !this.tipsValue &&
      !this.paymentRequest?.advisor_income
    );
  }

  public get seconds(): number {
    return (
      this.paymentRequest?.billable_seconds ??
      this.paymentRequest?.due_seconds ??
      0
    );
  }

  public get advisorIncome(): number {
    if (this.isFree) {
      return 0;
    }

    let advisorIncome = this.paymentRequest?.advisor_income;
    if (advisorIncome == null) {
      const secondsRate = new Decimal(this.hourlyRate).div(3600);
      advisorIncome = new Decimal(this.seconds)
        .mul(secondsRate)
        .mul(100)
        .trunc()
        .div(100)
        .toNumber();
    }

    return advisorIncome < 0.5 ? 0.5 : advisorIncome;
  }

  public get greytFee(): number {
    if (this.isFree) {
      return 0;
    }

    let greytFee = this.paymentRequest?.greyt_fee;

    if (greytFee == null) {
      greytFee = new Decimal(this.advisorIncome)
        .mul(GREYT_PERCENT)
        .mul(100)
        .ceil()
        .div(100)
        .toNumber();
    }

    return greytFee;
  }

  public get stripeFee(): number {
    if (this.isFree) {
      return 0;
    }

    let stripeFee = this.paymentRequest?.stripe_fee;

    if (stripeFee == null) {
      stripeFee = new Decimal(this.advisorIncome)
        .mul(STRIPE_PERCENT)
        .mul(100)
        .ceil()
        .div(100)
        .plus(STRIPE_TAX)
        .toNumber();
    }

    return stripeFee;
  }

  public get tax(): number {
    return 0;
  }

  public get total(): number {
    if (this.isFree) {
      return 0;
    }

    return (
      this.paymentRequest?.total ??
      this.advisorIncome + this.stripeFee + this.greytFee + this.tax
    );
  }

  public onDenyClick(): void {
    this.denySessionPayment.emit(this.id);
  }

  public onApproveClick(): void {
    this.approveSessionPayment.emit(this.id);
  }

  private getReceiptTitle() {
    if (!this.receiptTitle) {
      switch (true) {
        case this.isTips && !!this.tipsValue:
          this.receiptTitle = `${this.tipsValue}% tip paid`;
          break;

        case this.isFree:
          this.receiptTitle = 'No payment recorded';
          break;

        case this.approved:
          this.receiptTitle = 'Invoice paid';
          break;

        case this.denied:
          this.receiptTitle = 'Request denied';
          break;

        case this.type === PaymentSessionStatuses.awaitingPayment:
          this.receiptTitle = 'Awaiting payment';
          break;

        case this.type === 'overview_total_cost':
          this.receiptTitle = 'Overview of total costs';
          break;

        case this.type === 'messagePaymentSession':
          this.receiptTitle = 'Paid messages session';
          break;

        default:
          this.receiptTitle = 'Payment request';
          break;
      }
    }
  }

  ngOnInit(): void {
    this.getReceiptTitle();

    if (this.processing$) {
      this.showSpinner$ = this.processing$.pipe(
        shareReplay(1),
        filter((res) => res.id === this.id),
        map((res) => res.processing),
      );
    }
  }
}
