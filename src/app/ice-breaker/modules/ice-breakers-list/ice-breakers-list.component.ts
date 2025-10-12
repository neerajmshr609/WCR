import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  output,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IceBreakerCardComponent } from './ice-breaker-card/ice-breaker-card.component';
import { IceBreaker } from 'src/app/ice-breaker/model/response/ice-breaker.model';

@Component({
  selector: 'app-ice-breakers-list',
  templateUrl: './ice-breakers-list.component.html',
  styleUrls: ['./ice-breakers-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IceBreakerCardComponent],
  standalone: true,
})
export class IceBreakersListComponent {
  readonly iceBreakers = input.required<IceBreaker[]>();
  readonly opened = signal<IceBreaker | null>(null);
  readonly orgId = input<number | null>(null);

  readonly iceBreakerSelected = output<IceBreaker>();
  @Output() stepperNext = new EventEmitter<void>();

  isOpened(iceBreaker: IceBreaker) {
    const current = this.opened();
    return current && current.isEqualTo(iceBreaker);
  }

  open(iceBreaker: IceBreaker) {
    this.opened.set(iceBreaker);
  }

  onSelect(iceBreaker: IceBreaker) {
    this.iceBreakerSelected.emit(iceBreaker);
  }

  toggleOpened(iceBreaker: IceBreaker) {
    const next = this.isOpened(iceBreaker) ? null : iceBreaker;
    this.opened.set(next);

    if (next) {
      this.iceBreakerSelected.emit(iceBreaker); // notify parent selected ice breaker
      this.stepperNext.emit(); // notify parent to move step forward
    }
  }
}
