import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { takeUntil, tap, switchMap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { PayoutRequest } from 'src/app/shared/models/payout-request.model';
import { AdminService } from '../../admin.service';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payout-modal',
  templateUrl: './payout-modal.component.html',
  styleUrls: ['./payout-modal.component.scss'],
})
export class PayoutModalComponent extends BaseComponent implements OnInit {
  public form: UntypedFormGroup;
  public showReasonInput: boolean;
  public dataSource: MatTableDataSource<PayoutRequest>;
  public displayedColumns = [
    'comment',
    'wallet_to',
    'created_at',
    'amount_requested',
    'currency',
    'username',
    'email',
  ];

  constructor(
    private dialogRef: MatDialogRef<PayoutModalComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: PayoutRequest,
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      wallet_from: new UntypedFormControl(this.data.wallet_from),
      amount_sent: new UntypedFormControl(
        this.data.amount_sent / 100,
        Validators.required,
      ),
      reason_declined: new UntypedFormControl(this.data.reason_declined),
      status: new UntypedFormControl('success'),
    });

    this.form
      .get('status')
      .valueChanges.pipe(
        tap((res) => {
          this.showReasonInput = res === 'error' || res === 'declined';
        }),
        takeUntil(this.destroyed),
      )
      .subscribe();

    this.dataSource = new MatTableDataSource([this.data]);
  }

  public save() {
    const value = this.form.value as PayoutRequest;
    const { status, ...request } = value;
    value.amount_sent *= 100;
    this.adminService
      .editPayoutRequest(this.data.id, request)
      .pipe(
        switchMap(() =>
          this.adminService.changePayoutStatus(this.data.id, status),
        ),
        tap((res: PayoutRequest) => {
          this.dialogRef.close(res);
        }),
      )
      .subscribe();
  }
}
