import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  computed,
  HostListener,
} from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-arrow-right-circle-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './arrow-right-circle-icon.component.html',
  styleUrl: './arrow-right-circle-icon.component.scss',
})
export class ArrowRightCircleIconComponent extends BaseIconDirective {
  readonly color = input('#1E1E1E');
  readonly hoverColor = input<string | null>(null);
  private readonly mouseOver = signal(false);

  readonly currentColor = computed(() => {
    const hoverColor = this.hoverColor();
    return hoverColor && this.mouseOver() ? hoverColor : this.color();
  });

  @HostListener('mouseover')
  setMouseOver() {
    this.mouseOver.set(true);
  }

  @HostListener('mouseleave')
  setMouseLeave() {
    this.mouseOver.set(false);
  }
}
