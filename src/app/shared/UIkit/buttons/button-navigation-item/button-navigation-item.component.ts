import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IButtonNavigationItem } from './button-navigation-item.interface';
import { IconRenderComponent } from '../../../icons/_base/icon-render/icon-render.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponentRenderContext } from '../../../icons/_base/icon-type-def';

@Component({
  selector: 'app-button-navigation-item',
  standalone: true,
  imports: [CommonModule, IconRenderComponent, TranslateModule, RouterLinkActive, RouterLink],
  templateUrl: './button-navigation-item.component.html',
  styleUrls: ['./button-navigation-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonNavigationItemComponent {
  readonly navigationItem = input.required<IButtonNavigationItem>();
  readonly routerLink = computed(() => this.navigationItem().path);
  readonly navigationTitle = computed(() => this.navigationItem().title);

  readonly isActive = signal(false);

  readonly navigationItemWithRenderContext = computed(() => {
    const navigationItem = this.navigationItem();
    const isActive = this.isActive();
    const iconRenderContext: Partial<IconComponentRenderContext> = {
      color: isActive ? '#F5F5F5' : '#1E1E1E',
      strokeWidth: 1.6,
    };
    return { ...navigationItem, icon_render_context: iconRenderContext };
  });
}
