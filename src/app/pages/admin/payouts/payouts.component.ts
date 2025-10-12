import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { throwError } from 'rxjs';
import { catchError, takeUntil, tap, switchMap, filter } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { PayoutRequest } from 'src/app/shared/models/payout-request.model';
import { AdminService } from '../admin.service';
import { PayoutModalComponent } from './payout-modal/payout-modal.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-payouts',
  templateUrl: './payouts.component.html',
  styleUrls: ['./payouts.component.scss'],
})
export class PayoutsComponent extends BaseComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  public dataSource: MatTableDataSource<PayoutRequest>;
  public displayedColumns = [
    'status',
    'comment',
    'wallet_from',
    'wallet_to',
    'created_at',
    'updated_at',
    'completed_at',
    'amount_requested',
    'currency',
    'amount_sent',
    'username',
    'email',
  ];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getPayoutRequests();
  }

  private getPayoutRequests() {
    this.adminService
      .getPayoutRequests()
      .pipe(
        tap((res: PayoutRequest[]) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
        }),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  public selectElement(element: PayoutRequest, index: number) {
    document.documentElement.style.cursor = 'wait';
    this.adminService
      .changePayoutStatus(element.id, 'in_progress')
      .pipe(
        tap(() => {
          document.documentElement.style.cursor = 'default';
          element.status = 'in_progress';
        }),
        switchMap(() => {
          const dialog = this.dialog.open(PayoutModalComponent, {
            maxWidth: '90vw',
            data: element,
          });
          return dialog.afterClosed();
        }),
        filter((res) => !!res),
        tap((res: PayoutRequest) => Object.assign(element, res)),
        takeUntil(this.destroyed),
        catchError((err) => {
          document.documentElement.style.cursor = 'default';
          return throwError(err);
        }),
      )
      .subscribe();
  }
}
