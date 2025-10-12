import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-audio-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './audio-icon.component.html',
  styleUrls: ['./audio-icon.component.scss'],
})
export class AudioIconComponent extends BaseIconDirective {}
