import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-no-x-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './no-x-icon.component.html',
  styleUrl: './no-x-icon.component.scss',
})
export class NoXIconComponent extends BaseIconDirective {}
