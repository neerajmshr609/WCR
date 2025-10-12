import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-long-arrow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-long-arrow.component.html',
  styleUrls: ['./icon-long-arrow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconLongArrowComponent extends BaseIconDirective {}
