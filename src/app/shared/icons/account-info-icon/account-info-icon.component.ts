import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-account-info-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account-info-icon.component.html',
  styleUrls: ['./account-info-icon.component.scss'],
})
export class AccountInfoIconComponent extends BaseIconDirective {}
