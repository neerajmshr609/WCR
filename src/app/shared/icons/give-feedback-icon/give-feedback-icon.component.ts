import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-give-feedback-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './give-feedback-icon.component.html',
  styleUrls: ['./give-feedback-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiveFeedbackIconComponent extends BaseIconDirective {}
