import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContentMenuComponent } from './components/_main-content-menu/main-content-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import { VisibleMenuItemsContainerComponent } from './components/visible-menu-items-container/visible-menu-items-container.component';

import { ButtonComponent } from '../shared/UIkit/button/button.component';
import { VisibleMenuButtonComponent } from '../shared/UIkit/buttons/visible-menu-button/visible-menu-button.component';
import { ButtonMoreVertComponent } from '../shared/UIkit/buttons/button-more-vert/button-more-vert.component';
import { DropdownListComponent } from '../shared/complex-ui-components/dropdown-list/dropdown-list.component';

@NgModule({
  declarations: [MainContentMenuComponent, VisibleMenuItemsContainerComponent],
  exports: [MainContentMenuComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatIcon,
    MatMenu,
    MatIconButton,
    MatMenuTrigger,
    MatMenuItem,
    ButtonComponent,
    VisibleMenuButtonComponent,
    ButtonMoreVertComponent,
    DropdownListComponent,
  ],
})
export class MainContentMenuModule {}
