import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-lupai-right-sidebar',
  standalone: true,
  imports: [NgClass, MatIcon, TranslateModule],
  templateUrl: './lupai-right-sidebar.component.html',
  styleUrls: ['./lupai-right-sidebar.component.scss'],
})
export class LupaiRightSidebarComponent {
  isOpen = input<boolean>(false);
  closeMenu = output<void>();
  menuAction = output<string>();

  onCloseMenu(): void {
    this.closeMenu.emit();
  }

  onMenuAction(action: string): void {
    this.menuAction.emit(action);
  }
}
