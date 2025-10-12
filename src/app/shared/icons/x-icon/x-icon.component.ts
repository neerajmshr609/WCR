import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-x-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './x-icon.component.html',
  styleUrl: './x-icon.component.scss',
})
export class XIconComponent extends BaseIconDirective {}
