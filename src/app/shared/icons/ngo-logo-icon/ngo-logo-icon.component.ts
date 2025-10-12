import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-ngo-ngo-logo-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ngo-logo-icon.component.html',
  styleUrls: ['../icon.base.component.scss'],
})
export class NgoLogoIconComponent extends BaseIconDirective {}
