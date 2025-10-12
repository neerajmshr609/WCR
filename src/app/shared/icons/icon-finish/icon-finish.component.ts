import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-finish',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-finish.component.html',
  styleUrls: ['./icon-finish.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconFinishComponent extends BaseIconDirective {}
