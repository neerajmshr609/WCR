import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IMenuItem } from '../../../../main-content-menu/model/menu-item';
import { IconRenderComponent } from '@icons/_base/icon-render/icon-render.component';

@Component({
  selector: 'app-visible-menu-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule, IconRenderComponent],
  templateUrl: './visible-menu-button.component.html',
  styleUrls: ['./visible-menu-button.component.scss'],
})
export class VisibleMenuButtonComponent {
  menuItem = input.required<IMenuItem>();
  selected = input<boolean>(false);
  readonly icon = computed(() => {
    const menuItem = this.menuItem();
    return { icon: menuItem.icon, icon_alt: menuItem.icon_alt };
  });
}
