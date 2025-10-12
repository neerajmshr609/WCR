import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  input,
  Output,
  viewChild,
} from '@angular/core';
import { IMenuItem } from '../../model/menu-item';

@Component({
  selector: 'app-visible-menu-items-container',
  templateUrl: './visible-menu-items-container.component.html',
  styleUrls: ['./visible-menu-items-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisibleMenuItemsContainerComponent {
  readonly visibleItems = input.required<IMenuItem[]>();
  readonly selectedItem = input.required<IMenuItem>();
  readonly displayDropdownBtn = input.required<boolean>();
  readonly dropdownIsActive = input<boolean>(false);
  readonly buttonTriggerRef = viewChild<ElementRef>('buttonTrigger');

  @Output() selectedItemChange = new EventEmitter<IMenuItem>();
  @Output() dropdownButtonClick = new EventEmitter<void>();

  isSelected(item: IMenuItem): boolean {
    const selected = this.selectedItem();
    return selected && selected.param === item.param;
  }

  clickItemHandler(item: IMenuItem) {
    if (!this.isSelected(item) && !item.disabled) {
      this.selectedItemChange.emit(item);
    }
  }

  dropdownButtonClickHandler() {
    this.dropdownButtonClick.emit();
  }
}
