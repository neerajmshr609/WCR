import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '@icons/base-icon.directive';

@Component({
  selector: 'app-icon-draggable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-draggable.component.html',
  styleUrls: ['./icon-draggable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconDraggableComponent extends BaseIconDirective {}
