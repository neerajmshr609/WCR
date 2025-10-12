import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseCardIconComponent } from '../../../icons/close-card-icon/close-card-icon.component';
import { IconCheckCircleComponent } from '../../../icons/icon-check-circle/icon-check-circle.component';

@Component({
  selector: 'app-close-card-button',
  standalone: true,
  imports: [CommonModule, CloseCardIconComponent, IconCheckCircleComponent],
  templateUrl: './close-card-button.component.html',
  styleUrls: ['./close-card-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseCardButtonComponent {}
