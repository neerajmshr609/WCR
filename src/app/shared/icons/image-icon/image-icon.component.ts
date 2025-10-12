import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-image-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image-icon.component.html',
  styleUrl: './image-icon.component.scss',
})
export class ImageIconComponent extends BaseIconDirective {}
