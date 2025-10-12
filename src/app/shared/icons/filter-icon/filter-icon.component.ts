import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-filter-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-icon.component.html',
  styleUrls: ['./filter-icon.component.scss'],
})
export class FilterIconComponent extends BaseIconDirective {}
