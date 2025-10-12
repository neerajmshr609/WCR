import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-linkedin-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './linkedin-icon.component.html',
  styleUrl: './linkedin-icon.component.scss',
})
export class LinkedinIconComponent extends BaseIconDirective {}
