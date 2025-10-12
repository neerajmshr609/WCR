import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserSkill } from '../../../../shared/models/UserSkill.model';
import {
  ConnectedPosition,
  ConnectionPositionPair,
} from '@angular/cdk/overlay';

@Component({
  selector: 'app-total-score',
  templateUrl: './total-score.component.html',
  styleUrls: ['./total-score.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalScoreComponent {
  @Input() userSkill: UserSkill;
  @Input() smallBtn = false;
  isOpen = false;
  readonly positions: ConnectedPosition[] = [
    new ConnectionPositionPair(
      { originX: 'end', originY: 'bottom' },
      { overlayX: 'end', overlayY: 'bottom' },
    ),
  ];

  readonly offsetX = 13;
  readonly offsetY = 10;

  openPopup(): void {
    if (this.smallBtn) {
      return;
    }
    this.isOpen = !this.isOpen;
  }
}
