import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-skills-tools-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills-tools-icon.component.html',
  styleUrls: ['./skills-tools-icon.component.scss'],
})
export class SkillsToolsIconComponent extends BaseIconDirective {}
