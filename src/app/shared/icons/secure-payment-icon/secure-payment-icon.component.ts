import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-secure-payment-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './secure-payment-icon.component.html',
  styleUrls: ['./secure-payment-icon.component.scss'],
})
export class SecurePaymentIconComponent extends BaseIconDirective {}
