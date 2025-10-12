import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-drag-handle-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drag-handle-icon.component.html',
  styleUrls: ['./drag-handle-icon.component.scss'],
})
export class DragHandleIconComponent extends BaseIconDirective {}
