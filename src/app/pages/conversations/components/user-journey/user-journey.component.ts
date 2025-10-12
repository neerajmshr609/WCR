import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { JourneyItem } from 'src/app/shared/models/journey-item';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-user-journey',
  templateUrl: './user-journey.component.html',
  styleUrls: ['./user-journey.component.scss'],
})
export class UserJourneyComponent extends BaseComponent implements OnInit {
  @Input() journeyItems: Array<JourneyItem>;
  @Input() feedbackPath$: BehaviorSubject<string>;
  @Input() clearSelection$: Observable<void>;

  @Output() journeyClickEvt = new EventEmitter<JourneyItem>();

  selectedJourney: JourneyItem;
  isMobile: boolean;

  constructor(private breakpointObserver: BreakpointObserver) {
    super();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(max-width: 970px)')
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => (this.isMobile = res.matches));

    this.feedbackPath$
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => (this.selectedJourney = null));

    this.clearSelection$
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => (this.selectedJourney = null));
  }

  onJourneyClick(journeyItem: JourneyItem) {
    if (journeyItem.key === this.selectedJourney?.key) {
      this.selectedJourney = null;
      this.journeyClickEvt.emit(null);
      return;
    }

    this.selectedJourney = journeyItem;
    this.journeyClickEvt.emit(this.selectedJourney);
  }
}
