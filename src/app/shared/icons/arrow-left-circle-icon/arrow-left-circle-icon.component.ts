import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  signal,
} from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-arrow-left-circle-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './arrow-left-circle-icon.component.html',
  styleUrl: './arrow-left-circle-icon.component.scss',
})
export class ArrowLeftCircleIconComponent extends BaseIconDirective {
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
