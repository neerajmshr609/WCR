import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ParsedRatebackObject,
  RatebackObject,
} from '../../models/rateback-object';

@Component({
  selector: 'app-rateback-selector',
  templateUrl: './rateback-selector.component.html',
  styleUrls: ['./rateback-selector.component.scss'],
})
export class RatebackSelectorComponent implements OnInit, OnChanges {
  @Input() public ratebacks: RatebackObject;
  @Input() public readonly: boolean;
  @Input() public isSmall: boolean;
  @Input() public isBig: boolean;
  @Input() public isFilledIcon: boolean;
  @Input() public type: 'feedbacktypes' | 'ratebacks' = 'ratebacks';

  // for inbox
  @Input() public showOutline: boolean;
  @Input() public preselectedRateback: number;

  // for guess card
  @Input() public showWinLose: boolean;
  @Input() public winner: number;

  @Output() public selectedRateback = new EventEmitter<number>();

  public parsedRatebacks: ParsedRatebackObject[];

  public selectedRatebackInsights: number;
  public selectedWinLose: number;

  constructor() {}

  ngOnInit(): void {
    if (this.preselectedRateback) {
      this.selectedRatebackInsights = this.preselectedRateback;
    }

    if (!this.readonly) {
      this.parseRatebacks();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.ratebacks?.currentValue) {
      return;
    }

    if (
      this.ratebackChanged(
        changes.ratebacks.currentValue,
        changes.ratebacks.previousValue,
      )
    ) {
      this.parseRatebacks();
    }
  }

  private ratebackChanged(current: RatebackObject, previous: RatebackObject) {
    if (!current) {
      return false;
    }

    if (current && !previous) {
      return true;
    }

    return Object.keys(current).some((key) => {
      if (current[key] !== previous[key]) {
        return true;
      }
    });
  }

  public selectRateback(event: number) {
    if (this.showWinLose) {
      this.selectedWinLose = event;
    }

    if (this.showOutline) {
      this.selectedRatebackInsights = event;
    }

    this.selectedRateback.emit(event);
  }

  private parseRatebacks() {
    if (this.type === 'ratebacks') {
      this.parsedRatebacks = [
        {
          type: 'discouraging',
          name: 'stats.rate_backs.disrespectful',
          value: -5,
          count: this.ratebacks?.discouraging,
        },
        {
          type: 'unhelpful',
          name: 'stats.rate_backs.unhelpful',
          value: -1,
          count: this.ratebacks?.unhelpful,
        },
        {
          type: 'helpful',
          name: 'stats.rate_backs.helpful',
          value: 1,
          count: this.ratebacks?.helpful,
        },
        {
          type: 'inspiring',
          name: 'stats.rate_backs.brilliant_insight',
          value: 5,
          count: this.ratebacks?.inspiring,
        },
      ];
    }

    if (this.type === 'feedbacktypes') {
      this.parsedRatebacks = [
        {
          type: 'strengths',
          name: 'stats.rate_backs.strengths',
          value: 1,
          count: this.ratebacks?.strengths,
        },
        {
          type: 'weaknesses',
          name: 'stats.rate_backs.weaknesses',
          value: 2,
          count: this.ratebacks?.weaknesses,
        },
        {
          type: 'nextsteps',
          name: 'stats.rate_backs.next_steps',
          value: 3,
          count: this.ratebacks?.nextsteps,
        },
        {
          type: 'links',
          name: 'stats.rate_backs.links',
          value: 4,
          count: this.ratebacks?.links,
        },
      ];
    }
  }

  public getOutlineColor(value: number) {
    switch (value) {
      case -5: {
        return '#D9593C';
      }
      case -1: {
        return '#E3BE30';
      }
      case 1: {
        return '#D6D959';
      }
      case 5: {
        return '#00C67E';
      }
    }
  }
}
