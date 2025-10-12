import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-download-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './download-icon.component.html',
  styleUrl: './download-icon.component.scss',
})
export class DownloadIconComponent extends BaseIconDirective {}
