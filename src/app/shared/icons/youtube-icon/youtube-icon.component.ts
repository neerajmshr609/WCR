import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-youtube-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './youtube-icon.component.html',
  styleUrl: './youtube-icon.component.scss',
})
export class YoutubeIconComponent extends BaseIconDirective {}
