import { AfterViewInit, Component, OnInit } from '@angular/core';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-transactions-cap',
  templateUrl: './transactions-cap.component.html',
  styleUrls: ['./transactions-cap.component.scss'],
})
export class TransactionsCapComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  currentUser: User;

  constructor(
    private authService: AuthService,
    public transactionsService: TransactionsService,
  ) {
    super();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.authService.userSubject$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        tap((res: User) => (this.currentUser = res)),
      )
      .subscribe();
  }
}
