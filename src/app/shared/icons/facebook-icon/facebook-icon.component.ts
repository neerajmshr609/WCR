import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-facebook-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facebook-icon.component.html',
  styleUrl: './facebook-icon.component.scss',
})
export class FacebookIconComponent extends BaseIconDirective {}
