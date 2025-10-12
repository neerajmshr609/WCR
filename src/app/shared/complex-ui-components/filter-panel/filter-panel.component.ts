import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IChipsItem } from '../../UIkit/chips-item/chips-item.interface';
import { IFilterPanelOutput } from './filter-pannel.interface';
import { SearchInputComponent } from '../../UIkit/inputs/search-input/search-input.component';
import { FiltersListHorizontalComponent } from '../filters-list-horizontal/filters-list-horizontal.component';
import { ButtonFilterComponent } from '../../UIkit/buttons/button-filter/button-filter.component';
import { ResizeService } from '../../../services/resize.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  bounceInDownOnEnterAnimation,
  bounceInLeftOnEnterAnimation,
  bounceOutLeftOnLeaveAnimation,
  bounceOutUpOnLeaveAnimation,
} from 'angular-animations';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [
    CommonModule,
    SearchInputComponent,
    FiltersListHorizontalComponent,
    ButtonFilterComponent,
  ],
  animations: [
    bounceInLeftOnEnterAnimation(),
    bounceOutUpOnLeaveAnimation(),
    bounceOutLeftOnLeaveAnimation(),
    bounceInDownOnEnterAnimation(),
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('300ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent<F extends IChipsItem> {
  readonly filterItems = input.required<F[]>();
  readonly actionsTemplate = input<null | TemplateRef<unknown>>(null);
  readonly filtersChanged = output<IFilterPanelOutput<F>>();

  readonly displayColumn = input(false);
  readonly selectedFilters = signal<F[]>([]);
  readonly searchInputValue = signal<string>('');
  readonly focusTextInput = output<FocusEvent>();

  readonly placeholder = input('Search');

  readonly isActiveFilterButton = computed(
    () => !!this.selectedFilters().length,
  );
  readonly isMobileScreen = toSignal(this._resizeService.isSmallest$);
  public isHiddenFilters = model();

  constructor(private readonly _resizeService: ResizeService) {
    effect(() => {
      this.filtersChanged.emit({
        textFilter: this.searchInputValue(),
        selectedFilters: this.selectedFilters(),
      });
    });
  }

  toggleDisplayFilters() {
    if (this.isHiddenFilters()) {
      this._showFilters();
    } else {
      this._hideFilters();
    }
  }

  private _showFilters() {
    this.isHiddenFilters.set(false);
  }

  private _hideFilters() {
    this.isHiddenFilters.set(true);
  }
}
