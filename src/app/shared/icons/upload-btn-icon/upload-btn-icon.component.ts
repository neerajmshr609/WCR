import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-upload-btn-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './upload-btn-icon.component.html',
  styleUrls: ['./upload-btn-icon.component.scss'],
})
export class UploadBtnIconComponent extends BaseIconDirective {}
