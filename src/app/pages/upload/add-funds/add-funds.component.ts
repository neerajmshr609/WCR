import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { Router } from '@angular/router';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { AuthService } from 'src/app/auth/auth.service';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { User } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-funds',
  templateUrl: './add-funds.component.html',
  styleUrls: ['./add-funds.component.scss'],
})
export class AddFundsComponent extends BaseComponent implements OnInit {
  error: string;
  paymentInProgress = false;
  currentUser: User;
  uploadPrice: string;
  public payPalConfig?: IPayPalConfig;
  @ViewChild('priceInput', { static: false }) priceInput: ElementRef;

  constructor(
    private ngZone: NgZone,
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private router: Router,
    public transactionsService: TransactionsService,
    private titleService: Title,
  ) {
    super();
  }

  ngOnInit() {
    this.titleService.setTitle('Add funds');
    this.initPaypal();
    this.fetchUser();
  }

  fetchUser() {
    this.authService.userSubject$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        tap((res: User) => (this.currentUser = res)),
      )
      .subscribe();
  }

  initPaypal() {
    const price = this.transactionsService.uploadPrice().toString();
    this.uploadPrice = price;

    this.payPalConfig = {
      clientId: environment.paypal.clientID,
      currency: 'USD',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: this.priceInput.nativeElement.value
                  ? this.priceInput.nativeElement.value
                  : price,
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: this.priceInput.nativeElement.value
                      ? this.priceInput.nativeElement.value
                      : price,
                  },
                },
              },
              items: [
                {
                  name: 'Grey.me project upload',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'USD',
                    value: this.priceInput.nativeElement.value
                      ? this.priceInput.nativeElement.value
                      : price,
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions,
        );
        actions.order.get().then((details) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details,
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data,
        );
        this.transactionsService
          .createTransaction(
            this.currentUser.id,
            'top_up',
            this.priceInput.nativeElement.value,
          )
          .subscribe(
            () => {
              this.onAfterPayment();
            },
            () => {
              this.error = 'An error occurred';
              this.paymentInProgress = false;
            },
          );
      },
      onCancel: (data, actions) => {
        this.error = 'Payment cancelled';
        this.paymentInProgress = false;
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        this.error = 'An error occurred';
        this.paymentInProgress = false;
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        this.paymentInProgress = true;
      },
    };
  }

  onAfterPayment() {
    this.paymentInProgress = false;
    this.analyticsService.trackEvent('Wallet', 'top-up');
    this.navigate(['/rateflow']);
  }

  navigate(commands: any[]): void {
    this.ngZone.run(() => this.router.navigate(commands)).then();
  }
}
