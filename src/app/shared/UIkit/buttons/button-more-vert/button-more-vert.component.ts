import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconMoreVerticalComponent } from '@icons/icon-more-vertical/icon-more-vertical.component';

@Component({
  selector: 'app-button-more-vert',
  standalone: true,
  imports: [CommonModule, IconMoreVerticalComponent],
  templateUrl: './button-more-vert.component.html',
  styleUrls: ['./button-more-vert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonMoreVertComponent {
  readonly isActive = input<boolean>(false);

  readonly color = input('#F3F3F3');
  readonly borderColor = input('#2C2C2C');
  readonly backgroundColor = input('#2C2C2C');
  readonly hoverBackgroundColor = input('#1E1E1E');

  readonly activeColor = input('#1E1E1E');
  readonly activeBorderColor = input('#767676');
  readonly activeBackgroundColor = input('#E3E3E3');
  readonly activeHoverBackgroundColor = input('#CDCDCD');

  readonly currentBorderColor = computed(() => {
    return this.isActive()
      ? untracked(() => this.activeBorderColor())
      : untracked(() => this.borderColor());
  });
  readonly currentColor = computed(() => {
    return this.isActive()
      ? untracked(() => this.activeColor())
      : untracked(() => this.color());
  });

  readonly currentBackgroundColor = computed(() => {
    const isActive = this.isActive();
    const mouseover = this._mouseover();
    return isActive
      ? mouseover
        ? untracked(() => this.activeHoverBackgroundColor())
        : untracked(() => this.activeBackgroundColor())
      : mouseover
        ? untracked(() => this.hoverBackgroundColor())
        : untracked(() => this.backgroundColor());
  });

  private readonly _mouseover = signal(false);

  constructor(readonly elementRef: ElementRef) {}

  mouseleaveHandler(): void {
    this._mouseover.set(false);
  }

  mouseoverHandler(): void {
    this._mouseover.set(true);
  }
}
