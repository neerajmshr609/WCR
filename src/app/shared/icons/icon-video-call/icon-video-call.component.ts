import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '@icons/base-icon.directive';

@Component({
  selector: 'app-icon-video-call',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-video-call.component.html',
  styleUrls: ['./icon-video-call.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconVideoCallComponent extends BaseIconDirective {}
