import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-ngo-footer-logo-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ngo-footer-logo-icon.component.html',
  styleUrls: ['./ngo-footer-logo-icon.component.scss'],
})
export class NgoFooterLogoIconComponent extends BaseIconDirective {}
