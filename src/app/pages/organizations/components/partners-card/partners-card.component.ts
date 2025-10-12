import { Component, input } from '@angular/core';
import { IOrgPartner } from '../../../usersettings/interfaces';

@Component({
  selector: 'app-partners-card',
  templateUrl: './partners-card.component.html',
  styleUrls: ['./partners-card.component.scss'],
})
export class PartnersCardComponent {
  partner = input<IOrgPartner>();
}
