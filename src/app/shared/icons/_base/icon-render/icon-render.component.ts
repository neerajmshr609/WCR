import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconType } from '../icon-type-def';
import { TranslateModule } from '@ngx-translate/core';
import { parseIcon } from '../icon.model';

@Component({
  selector: 'app-icon-render',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './icon-render.component.html',
  styleUrls: ['../../icon.base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconRenderComponent {
  readonly icon = input.required<
    { icon: IconType; icon_alt?: string } & object
  >();
  readonly parsedIcon = computed(() => parseIcon(this.icon()?.icon));
  readonly componentIconInputs = input<{ [key: string]: any }>({});
}
