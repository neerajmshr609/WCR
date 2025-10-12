import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '@icons/base-icon.directive';

@Component({
  selector: 'app-icon-double-right-arrow',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-double-right-arrow.component.html',
  styleUrls: ['./icon-double-right-arrow.component.scss'],
})
export class IconDoubleRightArrowComponent extends BaseIconDirective {}
