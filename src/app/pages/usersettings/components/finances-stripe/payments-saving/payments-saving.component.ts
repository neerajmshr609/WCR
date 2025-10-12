import { Component, input } from '@angular/core';
import { Bonus } from '../../../constants';
import { BonusItem } from '../../../interfaces';

@Component({
  selector: 'app-payments-saving',
  templateUrl: './payments-saving.component.html',
  styleUrls: ['./payments-saving.component.scss'],
})
export class PaymentsSavingComponent {
  saveBonus: BonusItem[] = Bonus;
}
