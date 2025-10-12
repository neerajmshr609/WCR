import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-cancel-bordered',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-cancel-bordered.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./icon-cancel-bordered.component.scss'],
})
export class IconCancelBorderedComponent extends BaseIconDirective {}
