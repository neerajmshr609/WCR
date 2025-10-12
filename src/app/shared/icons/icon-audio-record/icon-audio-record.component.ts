import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-audio-record',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-audio-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./icon-audio-record.component.scss'],
})
export class IconAudioRecordComponent extends BaseIconDirective {}
