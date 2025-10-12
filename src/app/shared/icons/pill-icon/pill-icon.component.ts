import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-pill-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pill-icon.component.html',
  styleUrl: './pill-icon.component.scss',
})
export class PillIconComponent extends BaseIconDirective {}
