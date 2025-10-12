import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  input,
  Output,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DropdownListItemComponent } from '../../UIkit/dropdown-list-item/dropdown-list-item.component';
import { AlignBy, DropdownListItem } from './dropdown-list.interface';
import { BaseComponent } from '../../components/base.component';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MouseEventWithHtmlTarget } from '../../lib/ts-utils.lib';

@Component({
  selector: 'app-dropdown-list',
  standalone: true,
  imports: [CommonModule, DropdownListItemComponent],
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownListComponent<
  T extends DropdownListItem,
> extends BaseComponent {
  items = input.required<T[]>();
  selected = input<T | null>(null);
  disabled = input<T[]>([]);
  alignBy = input<AlignBy>('center');
  buttonTriggerRef = input.required<ElementRef<any>>();

  @Output() selectedChange = new EventEmitter<T>();
  @Output() outsideClick = new EventEmitter<MouseEventWithHtmlTarget>();

  @HostBinding('class')
  get classes() {
    return {
      center: this.alignBy() === 'center',
      right: this.alignBy() === 'right',
    };
  }

  constructor(
    @Inject(DOCUMENT)
    private readonly _document: Document,
    private readonly _elementRef: ElementRef,
  ) {
    super();
    this.subscribeOnOutsideClick();
  }

  isDisabled(item: T): boolean {
    return !!this.disabled().find((_) => _.param === item.param);
  }

  isSelected(item: T): boolean {
    return !!(
      this.selected() && this.items().find((_) => _.param === item.param)
    );
  }

  clickItemHandler(item: T): void {
    if (!this.isDisabled(item) && !this.isSelected(item)) {
      this.selectedChange.emit(item);
    }
  }

  subscribeOnOutsideClick(): void {
    fromEvent(this._document, 'mouseup')
      .pipe(takeUntil(this.destroyed))
      .subscribe((event: MouseEventWithHtmlTarget) => {
        if (
          this._elementRef.nativeElement.contains(event.target) ||
          this.buttonTriggerRef()?.nativeElement.contains(event.target)
        ) {
          return;
        }
        this.outsideClick.emit(event);
      });
  }
}
