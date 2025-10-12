import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-search-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-icon.component.html',
  styleUrls: ['./search-icon.component.scss'],
})
export class SearchIconComponent extends BaseIconDirective {}
