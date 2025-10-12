import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-arrow-up-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './arrow-up-icon.component.html',
  styleUrl: './arrow-up-icon.component.scss',
})
export class ArrowUpIconComponent extends BaseIconDirective {}
