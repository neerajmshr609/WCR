import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-camera-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './camera-icon.component.html',
  styleUrl: './camera-icon.component.scss',
})
export class CameraIconComponent extends BaseIconDirective {}
