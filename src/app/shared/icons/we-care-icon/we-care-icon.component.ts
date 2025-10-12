import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-we-care-icon',
  templateUrl: './we-care-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./we-care-icon.component.scss'],
})
export class WeCareIconComponent extends BaseIconDirective {}
