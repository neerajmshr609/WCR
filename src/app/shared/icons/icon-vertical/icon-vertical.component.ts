import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '@icons/base-icon.directive';

@Component({
  selector: 'app-icon-vertical',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-vertical.component.html',
  styleUrls: ['./icon-vertical.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconVerticalComponent extends BaseIconDirective {}
