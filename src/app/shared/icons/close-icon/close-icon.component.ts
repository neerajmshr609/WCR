import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-close-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './close-icon.component.html',
  styleUrl: '../icon.base.component.scss',
})
export class CloseIconComponent extends BaseIconDirective {}
