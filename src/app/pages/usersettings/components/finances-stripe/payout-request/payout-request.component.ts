import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { PayoutRequestsService } from 'src/app/services/payout-requests.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { PayoutRequest } from 'src/app/shared/models/payout-request.model';
import { PayoutRequestModalComponent } from '../payout-request-modal/payout-request-modal.component';

@Component({
  selector: 'app-payout-request',
  templateUrl: './payout-request.component.html',
  styleUrls: ['./payout-request.component.scss'],
})
export class PayoutRequestComponent extends BaseComponent implements OnInit {
  @Input() public mode: 'new' | 'created' | 'edit' = 'new';
  @Input() public amount: number;
  @Input() public dateCreated: Date;

  @Input() set requestIn(val: PayoutRequest) {
    this.request = val;
    this.init();
  }

  @Output() requestCreated = new EventEmitter<PayoutRequest>();
  @Output() requestDeleted = new EventEmitter<void>();
  request: PayoutRequest;
  public readonly currencies = [
    'bank transfer',
    'matic',
    'solana',
    'doge',
    'binance',
  ];
  public selectedCurrency: string;
  public walletForm = new UntypedFormGroup({
    account_holders_name: new UntypedFormControl(null),
    account_number: new UntypedFormControl(null),
    swift_bic: new UntypedFormControl(null),
    bank_info: new UntypedFormControl(null),
  });
  public title: string;

  constructor(
    private payoutRequestsService: PayoutRequestsService,
    private matDialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {}

  private init() {
    if (this.mode === 'new' || this.mode === 'edit') {
      this.selectedCurrency = this.currencies[0];

      if (this.request) {
        this.walletForm.patchValue(this.request);
        this.selectedCurrency = this.request.currency;
      }
    } else {
      this.dateCreated = this.request.created_at;
      this.amount = this.request.amount_requested;
      this.selectedCurrency = this.request.currency;
    }

    this.getTitle();
  }

  private getTitle() {
    if (this.mode === 'new') {
      this.title = 'payout_request.title.request_for_payout';
      return;
    }

    switch (this.request.status) {
      case 'created':
        this.title = 'payout_request.title.request_sent';
        break;
      case 'success':
        this.title = 'payout_request.title.money_sent';
        break;
      case 'in_progress':
        this.title = 'payout_request.title.request_in_progress';
        break;
      case 'error':
        this.title = 'payout_request.title.review_payment_data';
        break;
      case 'declined':
        this.title = 'payout_request.title.payment_declined';
        break;
      default:
        break;
    }
  }

  public editRequest() {
    const dialog = this.matDialog.open(PayoutRequestModalComponent, {
      width: '362px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'reduced-padding-20',
      data: {
        request: this.request,
      },
    });

    const subscription = dialog
      .afterClosed()
      .pipe(
        tap((res) => {
          if (res) {
            this.request = res;
            this.requestCreated.emit(res);
          }
          subscription.unsubscribe();
        }),
      )
      .subscribe();
  }

  public cancelRequest() {
    const dialog = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        message: 'payout_request.cancel_msg',
      },
    });

    const subscription = dialog
      .afterClosed()
      .pipe(
        switchMap((res) => {
          if (res) {
            return this.payoutRequestsService
              .deletePayoutRequest(this.request.id)
              .pipe(tap(() => this.requestDeleted.emit()));
          }
          return of(null);
        }),
        tap(() => subscription.unsubscribe()),
      )
      .subscribe();
  }

  public submitForm() {
    if (!this.walletForm.valid) {
      this.walletForm.markAllAsTouched();
      return;
    }

    const request = {
      amount_requested: this.amount,
      ...this.walletForm.value,
      currency: this.selectedCurrency,
    };

    if (this.mode === 'new') {
      this.payoutRequestsService
        .createPayoutRequest(request)
        .pipe(
          tap((res) => this.requestCreated.emit(res)),
          takeUntil(this.destroyed),
        )
        .subscribe();
    } else {
      this.payoutRequestsService
        .editPayoutRequest(this.request.id, request)
        .pipe(
          tap((res) => this.requestCreated.emit(res)),
          takeUntil(this.destroyed),
        )
        .subscribe();
    }
  }
}
