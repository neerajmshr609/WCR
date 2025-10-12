import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-move-icon',
  templateUrl: './move-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./move-icon.component.scss'],
})
export class MoveIconComponent extends BaseIconDirective {}
