import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-get-support-icon',
  templateUrl: './get-support-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./get-support-icon.component.scss'],
})
export class GetSupportIconComponent extends BaseIconDirective {}
