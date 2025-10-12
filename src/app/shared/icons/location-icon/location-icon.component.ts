import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-location-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './location-icon.component.html',
  styleUrl: './location-icon.component.scss',
})
export class LocationIconComponent extends BaseIconDirective {}
