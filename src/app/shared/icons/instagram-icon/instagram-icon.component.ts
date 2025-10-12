import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-instagram-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './instagram-icon.component.html',
  styleUrl: './instagram-icon.component.scss',
})
export class InstagramIconComponent extends BaseIconDirective {}
