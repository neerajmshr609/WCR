import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownListComponent } from '@ui-components/dropdown-list/dropdown-list.component';
import { ButtonMoreVertComponent } from '@ui-kit/buttons/button-more-vert/button-more-vert.component';
import { IIceBreakerCardDropdownMenuItem } from './ice-breaker-card-menu.interface';

@Component({
  selector: 'app-ice-breaker-card-menu',
  standalone: true,
  imports: [CommonModule, ButtonMoreVertComponent, DropdownListComponent],
  templateUrl: './ice-breaker-card-menu.component.html',
  styleUrls: ['./ice-breaker-card-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IceBreakerCardMenuComponent {
  readonly dropdownItems = input.required<IIceBreakerCardDropdownMenuItem[]>();
  readonly isOpen = signal(false);

  closeDropdown() {
    this.isOpen.set(false);
  }

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

  clickMenuItemHandler(item: IIceBreakerCardDropdownMenuItem) {
    item.action();
    this.closeDropdown();
  }
}
