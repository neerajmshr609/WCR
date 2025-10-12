import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-play-circle-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './play-circle-icon.component.html',
  styleUrl: './play-circle-icon.component.scss',
})
export class PlayCircleIconComponent extends BaseIconDirective {}
