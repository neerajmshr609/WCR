import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {
  @Output() filterEvt = new EventEmitter<number | string>();
  @Output() filterScheduledCalls = new EventEmitter<boolean>();

  @Input() users: Array<{ id: number; name: string }>;
  @Input() clearFilter$: Observable<boolean>;

  selectedId: number;
  isFilterScheduledCalls = false;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.clearFilter$.subscribe(() => {
      this.selectedId = null;
      this.cdRef.detectChanges();
    });
  }

  selectItem(selectedId: number): void {
    this.isFilterScheduledCalls = false;
    this.selectedId = selectedId === this.selectedId ? null : selectedId;
    this.filterEvt.emit(this.selectedId);
  }

  filter() {
    this.isFilterScheduledCalls = !this.isFilterScheduledCalls;
    this.selectedId = this.isFilterScheduledCalls ? undefined : null;
    this.filterEvt.emit(this.selectedId);
  }
}
