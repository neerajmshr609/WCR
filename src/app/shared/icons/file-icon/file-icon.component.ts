import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-file-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './file-icon.component.html',
  styleUrl: './file-icon.component.scss',
})
export class FileIconComponent extends BaseIconDirective {}
