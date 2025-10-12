import { Component, Inject, OnInit } from '@angular/core';
import { PayoutRequest } from 'src/app/shared/models/payout-request.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payout-request-modal',
  templateUrl: './payout-request-modal.component.html',
  styleUrls: ['./payout-request-modal.component.scss'],
})
export class PayoutRequestModalComponent implements OnInit {
  public mode: 'new' | 'edit';
  public date: Date;
  public amount: number;
  public request: PayoutRequest;
  public init: boolean;

  constructor(
    private dialorRef: MatDialogRef<PayoutRequestModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    const request = this.data.request as PayoutRequest;

    if (request) {
      this.mode = 'edit';
      this.date = request.created_at;
      this.amount = request.amount_requested;
      this.request = request;
    } else {
      this.mode = 'new';
      this.date = new Date();
      this.amount = this.data.amount;
    }

    this.init = true;
  }

  public onCreated(request: PayoutRequest) {
    this.dialorRef.close(request);
  }
}
