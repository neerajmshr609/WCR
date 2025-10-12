import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Ruleset } from '../../../../shared/models/ruleset';
import {
  ConnectedPosition,
  ConnectionPositionPair,
} from '@angular/cdk/overlay';

@Component({
  selector: 'app-available-time-slots',
  templateUrl: './available-time-slots.component.html',
  styleUrls: ['./available-time-slots.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableTimeSlotsComponent {
  @Input() rulsets: Ruleset[] = [];
  isOpen = false;

  readonly positions: ConnectedPosition[] = [
    new ConnectionPositionPair(
      { originX: 'end', originY: 'center' },
      { overlayX: 'end', overlayY: 'top' },
    ),
  ];

  readonly offsetX = 12;
  readonly offsetY = -27;
}
