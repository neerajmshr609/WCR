import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-info.component.html',
  styleUrls: ['./icon-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconInfoComponent extends BaseIconDirective {}
