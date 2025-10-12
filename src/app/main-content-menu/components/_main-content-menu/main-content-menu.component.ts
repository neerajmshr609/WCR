import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect, ElementRef,
  EventEmitter,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { IMenuItem } from '../../model/menu-item';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { isOutside } from '../../../shared/lib/native-dom-js.helpers';
import { MouseEventWithHtmlTarget } from '../../../shared/lib/ts-utils.lib';

@Component({
  selector: 'app-main-content-menu',
  templateUrl: './main-content-menu.component.html',
  styleUrls: ['./main-content-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContentMenuComponent implements OnInit {
  private readonly URL_PARAM_NAME = 'type';

  readonly menuItems = input.required<IMenuItem[]>();
  readonly allowDropdown = input<boolean>(true);
  readonly visibleItemsAmount = input<number>(
    this.allowDropdown() === false ? this.menuItems().length : 2,
  );
  readonly preselectedItem = input<IMenuItem | null>(null);
  readonly selectedItem = signal<IMenuItem | null>(null);
  @Output() changeSelectedItem = new EventEmitter<IMenuItem>();

  readonly visibleItems = computed(() => {
    const menuItems = this.menuItems();
    const selectedItemParam = (this.selectedItem() || menuItems[0]).param;
    let indexOfSelected = menuItems.findIndex(
      (_) => _.param === selectedItemParam,
    );

    if (indexOfSelected === -1) {
      indexOfSelected = 0;
    }
    const indexOfLastVisibleItem = this.visibleItemsAmount() - 1;
    const visibleItems = menuItems.slice(0, indexOfLastVisibleItem);

    if (indexOfSelected > indexOfLastVisibleItem) {
      visibleItems.push(menuItems[indexOfSelected]);
    } else {
      visibleItems.push(menuItems[indexOfLastVisibleItem]);
    }
    return visibleItems;
  });
  readonly invisibleItems = computed(() => {
    const visibleItems = this.visibleItems();
    return this.menuItems().filter(
      ({ param }) => !visibleItems.find((_) => _.param === param),
    );
  });

  // -------- Dropdown

  readonly displayDropdownBtn = computed(() => {
    return !!(this.allowDropdown() && this.invisibleItems().length);
  });
  readonly dropdownIsActive = signal(false);

  constructor(
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _elementRef: ElementRef,
  ) {
    this._subscribeUrlOnSelectedChange();
    this._subscribeOutputOnSelectedChange();
  }

  ngOnInit(): void {
    this._setPreselectedItem();
  }

  setSelected(item: IMenuItem) {
    if (this.dropdownIsActive()) {
      this.dropdownIsActive.set(false);
    }
    this.selectedItem.set(item);
  }

  dropdownButtonClickHandler() {
    if (this.displayDropdownBtn()) {
      const currentState = this.dropdownIsActive();
      this.dropdownIsActive.set(!currentState);
    }
  }

  clickOutsideDropdownHandler(event: MouseEventWithHtmlTarget) {
    if (isOutside(event, this._elementRef)) {
      this.dropdownIsActive.set(false);
    }
  }

  private _setPreselectedItem() {
    const preSelected = this.preselectedItem();
    if (preSelected) {
      this._setUrlParams(preSelected);
    } else {
      this._parseFromUrl()
        .pipe(map((_) => _ || this.menuItems()[0]))
        .subscribe((_) => {
          this.setSelected(_);
        });
    }
  }

  private _setUrlParams(item: IMenuItem) {
    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParams: { [this.URL_PARAM_NAME]: item.param || null },
      queryParamsHandling: 'merge',
    });
  }

  private _parseFromUrl() {
    return this._activatedRoute.queryParams.pipe(
      take(1),
      map((params) => {
        const param = params[this.URL_PARAM_NAME];
        return this.menuItems().find(
          (_) => _.param === param || (!param && !_.param),
        );
      }),
    );
  }

  private _subscribeUrlOnSelectedChange(): void {
    effect(() => {
      const selectedItem = this.selectedItem();
      if (selectedItem) {
        this._setUrlParams(selectedItem);
      }
    });
  }

  private _subscribeOutputOnSelectedChange(): void {
    effect(() => {
      const selectedItem = this.selectedItem();
      if (selectedItem) {
        this.changeSelectedItem.emit(selectedItem);
      }
    });
  }
}
