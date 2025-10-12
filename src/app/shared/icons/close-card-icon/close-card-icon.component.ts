import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-close-card-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './close-card-icon.component.html',
  styleUrls: ['../icon.base.component.scss'],
})
export class CloseCardIconComponent extends BaseIconDirective {
  readonly color = input('white');
  readonly strokeWidth = input(1.80475);
}
