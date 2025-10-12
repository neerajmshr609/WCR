import {
  Component,
  ChangeDetectionStrategy,
  output,
  input,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export interface LupaiMobileHeaderActions {
  onPlusAction: () => void;
  onMenuAction: () => void;
  onNavigateLeft: () => void;
  onNavigateRight: () => void;
}

@Component({
  selector: 'app-lupai-mobile-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lupai-mobile-header.component.html',
  styleUrls: ['./lupai-mobile-header.component.scss'],
  imports: [MatIcon],
})
export class LupaiMobileHeaderComponent {
  // Inputs
  readonly robotIconSrc = input<string>('assets/conversations/robot.svg');
  readonly showNavigationButtons = input<boolean>(true);
  readonly showActionButtons = input<boolean>(true);

  // Outputs
  readonly plusAction = output<void>();
  readonly menuAction = output<void>();
  readonly navigateLeft = output<void>();
  readonly navigateRight = output<void>();

  onPlusClick(): void {
    this.plusAction.emit();
  }

  onMenuClick(): void {
    this.menuAction.emit();
  }

  onNavigateLeftClick(): void {
    this.navigateLeft.emit();
  }

  onNavigateRightClick(): void {
    this.navigateRight.emit();
  }
}
