import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-add-payment-method-form',
  templateUrl: './add-payment-method-form.component.html',
  styleUrls: ['./add-payment-method-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPaymentMethodFormComponent implements OnInit {
  @Input() user: User;
  @Output() paymentMethodId: EventEmitter<string> = new EventEmitter<string>();

  private stripe: Stripe;
  isLoading = false;
  private card: any;

  ngOnInit(): void {
    loadStripe(environment.stripe.pk).then((stripe: Stripe) => {
      this.stripe = stripe;
      this.showStripePaymentMethods();
    });
  }

  private showStripePaymentMethods(): void {
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

  addPaymentCard(): void {
    this.isLoading = true;
    this.stripe
      .createPaymentMethod({
        type: 'card',
        card: this.card,
        billing_details: {
          email: this.user.email,
        },
      })
      .then((result) => {
        this.isLoading = false;
        if (result?.paymentMethod) {
          this.paymentMethodId.emit(result.paymentMethod.id);
        }
      });
  }
}
