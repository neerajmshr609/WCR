import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonChip } from './button-chip.interface';

@Component({
  selector: 'app-button-chip',
  standalone: true,
  imports: [CommonModule],
  template: `{{ chipItem().renderChipName }}`,
  styleUrls: ['./button-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonChipComponent {
  readonly chipItem = input.required<ButtonChip>();
  readonly isSelected = input(false);
  readonly canBeSelectedStyled = input(true);

  @HostBinding('class.selected')
  get selected() {
    return this.canBeSelectedStyled() && this.isSelected();
  }

  @HostBinding('class.can-be-selected')
  get canBeSelected() {
    return this.canBeSelectedStyled();
  }
}
