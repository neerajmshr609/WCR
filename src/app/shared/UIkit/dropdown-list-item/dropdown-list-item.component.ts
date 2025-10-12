import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostBinding,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IDropdownListItem } from './dropdown-list-item.interface';
import { take } from 'rxjs/operators';
import { IconRenderComponent } from '../../icons/_base/icon-render/icon-render.component';
import { Theme } from '../../complex-ui-components/dropdown-list/dropdown-list.interface';

@Component({
  selector: 'app-dropdown-list-item',
  standalone: true,
  imports: [CommonModule, TranslateModule, IconRenderComponent],
  templateUrl: './dropdown-list-item.component.html',
  styleUrls: ['./dropdown-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownListItemComponent {
  readonly menuItem = input.required<IDropdownListItem>();
  readonly disabled = input<boolean>(false);
  readonly selected = input<boolean>(false);
  readonly withoutHover = input<boolean>(false);
  readonly theme = input<Theme>('light');
  readonly icon = computed(() => {
    const menuItem = this.menuItem();
    return { icon: menuItem.icon, icon_alt: menuItem.icon_alt };
  });
  readonly hasIcon = computed(() => this.menuItem()?.icon);
  readonly description = signal<string>('');

  constructor(private readonly _translateService: TranslateService) {
    effect(
      () => {
        const menuItem = this.menuItem();
        if (menuItem?.description) {
          this._translateService
            .get(menuItem.description)
            .pipe(take(1))
            .subscribe((_) => {
              this.description.set(_);
            });
        }
      },
      { allowSignalWrites: true },
    );
  }

  @HostBinding('class')
  get classes() {
    return {
      dark: this.theme() === 'dark',
      light: this.theme() === 'light',
    };
  }
}
