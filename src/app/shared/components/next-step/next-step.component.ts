import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-next-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './next-step.component.html',
  styleUrls: ['./next-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextStepComponent {}
