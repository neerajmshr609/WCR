import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-reorder-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reorder-icon.component.html',
  styleUrls: ['./reorder-icon.component.scss'],
})
export class ReorderIconComponent extends BaseIconDirective {}
