import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IChipsItem } from '../../UIkit/chips-item/chips-item.interface';
import { ChipsItemComponent } from '../../UIkit/chips-item/chips-item.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-filters-list-horizontal',
  standalone: true,
  imports: [CommonModule, ChipsItemComponent],
  templateUrl: './filters-list-horizontal.component.html',
  styleUrls: ['./filters-list-horizontal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersListHorizontalComponent<F extends IChipsItem> {
  readonly filtersList = input.required<F[]>();
  readonly allowMultiple = input(true);
  readonly selectedFilters = model<F[]>([]);

  isSelected(item: F): boolean {
    return !!this.selectedFilters().find(_ => this._areEqual(_, item));
  }

  toggleSelected(item: F): void {
    if (this.isSelected(item)) {
      this._removeFromSelected(item);
    } else if (this.allowMultiple()) {
      this.selectedFilters.set([...this.selectedFilters(), item]);
    } else {
      this.selectedFilters.set([item]);
    }
  }

  private _removeFromSelected(item: F) {
    const newList = this.selectedFilters().filter(_ => !this._areEqual(_, item));
    this.selectedFilters.set(newList);
  }

  private _areEqual(item1: F, item2: F): boolean {
    if (typeof item1?.isEqualTo === 'function') {
      return item1.isEqualTo(item2);
    } else if (typeof item2?.isEqualTo === 'function') {
      return item2.isEqualTo(item1);
    } else if (typeof item1?.id === 'number' && typeof item2?.id === 'number') {
      return item1.id === item2.id;
    } else {
      // TODO: Refactor move logger and error throwing into separate service
      if (environment.production) {
        console.error('Internal application error');
      } else {
        throw new Error(`Failed to compare objects ${JSON.stringify(item1)} and ${JSON.stringify(item2)}`);
      }
    }
  }
}
