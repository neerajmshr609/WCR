import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-trends-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trends-icon.component.html',
  styleUrls: ['./trends-icon.component.scss'],
})
export class TrendsIconComponent extends BaseIconDirective {}
