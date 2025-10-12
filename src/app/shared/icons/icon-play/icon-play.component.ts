import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-play',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-play.component.html',
  styleUrls: ['./icon-play.component.scss'],
})
export class IconPlayComponent extends BaseIconDirective {}
