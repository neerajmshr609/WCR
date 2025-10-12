import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-complete-flag-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './complete-flag-icon.component.html',
  styleUrl: './complete-flag-icon.component.scss',
})
export class CompleteFlagIconComponent extends BaseIconDirective {}
