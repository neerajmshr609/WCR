import { CommonModule, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
} from '@angular/core';
import { UserIconComponent } from '../icons/user-icon/user-icon.component';
import { ButtonComponent } from '../UIkit/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconMoreVerticalComponent } from '../icons/icon-more-vertical/icon-more-vertical.component';

@Component({
  selector: 'app-more-menu',
  templateUrl: './more-menu.component.html',
  styleUrls: ['./more-menu.component.scss'],
  imports: [
    NgClass,
    CommonModule,
    UserIconComponent,
    ButtonComponent,
    TranslateModule,
    IconMoreVerticalComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoreMenuComponent {
  placement = input<'top' | 'bottom' | 'right' | 'left'>('right');
  menuTitle = input('');
  menuSubtitle = input('');
  menuList = input([]);

  isDropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isDropdownOpen = false;
    }
  }
}
