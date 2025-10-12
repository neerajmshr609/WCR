import { ChangeDetectionStrategy, Component, effect, EventEmitter, input, Input, Output } from '@angular/core';
import { ProjectSkill } from '../../models/ProjectSkill.model';

@Component({
  selector: 'app-select-skill-container',
  templateUrl: './select-skill-container.component.html',
  styleUrls: ['./select-skill-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSkillContainerComponent {
  isLoading = input(false);
  singleSelectSkill = input(false);
  @Output() pickedSkill: EventEmitter<ProjectSkill[]> = new EventEmitter<
    ProjectSkill[]
  >();
}
