import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderNavBarItemComponent } from '../header-nav-bar-item/header-nav-bar-item.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header-mobile-navbar-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterLinkActive, TranslateModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header-mobile-navbar-item.component.html',
  styleUrls: ['./header-mobile-navbar-item.component.scss'],
})
export class HeaderMobileNavbarItemComponent extends HeaderNavBarItemComponent {
  public description = input<string>(null);
}
