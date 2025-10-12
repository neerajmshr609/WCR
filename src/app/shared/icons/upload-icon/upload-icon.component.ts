import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-upload-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './upload-icon.component.html',
  styleUrls: ['../icon.base.component.scss'],
})
export class UploadIconComponent extends BaseIconDirective {}
