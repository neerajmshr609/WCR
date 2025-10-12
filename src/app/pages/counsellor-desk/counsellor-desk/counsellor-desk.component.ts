import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { COUNSELLOR_DESK_CARDS } from '../MOCK';
import { FilterService } from '../service/filter.service';

@Component({
  selector: 'app-counsellor-desk',
  templateUrl: './counsellor-desk.component.html',
  styleUrls: ['./counsellor-desk.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CounsellorDeskComponent {
  cards = COUNSELLOR_DESK_CARDS;
  isHoveredItem: number | null = null;

  constructor(readonly filterService: FilterService) {}

  addHoverState(id: number): void {
    this.isHoveredItem === id
      ? (this.isHoveredItem = null)
      : (this.isHoveredItem = id);
  }
}
