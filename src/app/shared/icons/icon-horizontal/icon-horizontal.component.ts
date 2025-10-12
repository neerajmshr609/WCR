import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '@icons/base-icon.directive';

@Component({
  selector: 'app-icon-horizontal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-horizontal.component.html',
  styleUrls: ['./icon-horizontal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconHorizontalComponent extends BaseIconDirective {}
