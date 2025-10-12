import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-counsellor-desk-icon',
  templateUrl: './counsellor-desk-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../icon.base.component.scss'],
})
export class CounsellorDeskIconComponent extends BaseIconDirective {
  readonly color = input('#1E1E1E');
}
