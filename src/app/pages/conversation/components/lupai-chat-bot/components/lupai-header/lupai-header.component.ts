import {
  Component,
  ChangeDetectionStrategy,
  output,
  input,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export interface LupaiHeaderActions {
  onPlusAction: () => void;
  onMenuAction: () => void;
  onNavigateLeft: () => void;
  onNavigateRight: () => void;
}

@Component({
  selector: 'app-lupai-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lupai-header.component.html',
  styleUrls: ['./lupai-header.component.scss'],
  imports: [MatIcon, TranslateModule],
})
export class LupaiHeaderComponent {
  // Inputs - keeping for backward compatibility, but using translations as default
  readonly title = input<string>();
  readonly subtitle = input<string>();
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

  onNavigateLeftClick(event: Event): void {
    this.navigateLeft.emit();
    (event.target as HTMLElement)?.blur();
  }

  onNavigateRightClick(event: Event): void {
    this.navigateRight.emit();
    (event.target as HTMLElement)?.blur();
  }
}
