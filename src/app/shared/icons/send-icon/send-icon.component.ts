import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-send-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './send-icon.component.html',
  styleUrl: './send-icon.component.scss',
})
export class SendIconComponent extends BaseIconDirective {}
