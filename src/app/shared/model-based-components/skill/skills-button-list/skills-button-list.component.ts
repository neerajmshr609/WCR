import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonChipComponent } from '../../../UIkit/buttons/button-chip/button-chip.component';
import { Skill } from '../../../../services/skill/model/skill.model';

@Component({
  selector: 'app-skills-button-list',
  standalone: true,
  imports: [CommonModule, ButtonChipComponent],
  templateUrl: './skills-button-list.component.html',
  styleUrls: ['./skills-button-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsButtonListComponent<T extends ButtonChipComponent & Skill> {
  readonly skills = input.required<T[]>();
  readonly selected = model<null | T>();

  buttonClickHandler(item: T) {
    if (this.isSelected(item)) {
      this.selected.set(null);
    } else {
      this.selected.set(item);
    }
  }

  isSelected(item: T) {
    return this.selected()?.isEqualTo(item);
  }
}
