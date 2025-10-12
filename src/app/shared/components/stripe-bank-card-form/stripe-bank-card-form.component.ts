import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { fromEvent, Observable, throwError } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

declare let Stripe: any;

@Component({
  selector: 'app-stripe-bank-card-form',
  templateUrl: './stripe-bank-card-form.component.html',
  styleUrls: ['./stripe-bank-card-form.component.scss'],
})
export class StripeBankCardFormComponent implements OnInit {
  @Input() secret: string;

  @Output() updatePaymentStatus = new EventEmitter<void>();

  stripe: any;
  private card: any;
  paymentInProgress: boolean;

  constructor(private cdr: ChangeDetectorRef) {}

  public onPayClick(): void {
    this.paymentInProgress = true;

    this.stripe
      .confirmCardPayment(this.secret, {
        payment_method: { card: this.card },
        setup_future_usage: 'off_session',
      })
      .then((result) => {
        this.paymentInProgress = false;

        const error = result.error;
        if (error) {
          const displayError = document.getElementById('card-errors');
          displayError.classList.add('active');
          displayError.textContent = error.message;

          return throwError(error);
        }

        this.updatePaymentStatus.emit();
      });
  }

  private showStripePaymentMethods(): void {
    this.cdr.detectChanges();

    const elements = this.stripe.elements();
    this.card = elements.create('card', {
      hidePostalCode: true,
    });

    this.card.mount('#card-element');
    this.card.on('change', ({ error }) => {
      const displayError = document.getElementById('card-errors');
      if (error) {
        displayError.classList.add('active');
        displayError.textContent = error.message;
      } else {
        displayError.classList.remove('active');
        displayError.textContent = '';
      }
    });
  }

  ngOnInit(): void {
    loadStripe(environment.stripe.pk).then((res) => {
      this.stripe = res;
      this.showStripePaymentMethods();
    });
  }
}
