import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-dollar-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dollar-icon.component.html',
  styleUrl: './dollar-icon.component.scss',
})
export class DollarIconComponent extends BaseIconDirective {}
