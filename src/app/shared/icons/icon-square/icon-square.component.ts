import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '@icons/base-icon.directive';

@Component({
  selector: 'app-icon-square',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-square.component.html',
  styleUrls: ['./icon-square.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSquareComponent extends BaseIconDirective {}
