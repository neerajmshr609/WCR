import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss'],
})
export class TipsComponent implements OnInit {
  @Input() processing$: Observable<{ processing: boolean; id: number }>;
  @Input() id: number;
  @Input() paid: boolean;
  @Input() isFeedbackSessionTip = false;

  @Output() denyTips = new EventEmitter<void>();
  @Output() payTips = new EventEmitter<number>();

  tipsValues = [5, 10, 15, 20, 25];
  showSpinner$: Observable<boolean>;

  constructor() {}

  public onPercentClick(value: number): void {
    this.payTips.emit(value);
  }

  public onDenyClick(): void {
    this.denyTips.emit();
  }

  ngOnInit(): void {
    if (this.processing$) {
      this.showSpinner$ = this.processing$.pipe(
        shareReplay(1),
        filter((res) => res.id === this.id),
        map((res) => res.processing),
      );
    }
  }
}
