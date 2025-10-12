import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ExpertiseTitleCardInput } from './expertise-title-card.interfaces';
import { UserIconComponent } from '../../../icons/user-icon/user-icon.component';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-expertise-title-card',
  templateUrl: './expertise-title-card.component.html',
  styleUrls: ['./expertise-title-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserIconComponent, UpperCasePipe],
  standalone: true,
})
export class ExpertiseTitleCardComponent {
  readonly openRequest = input.required<ExpertiseTitleCardInput>();
  readonly skillName = computed(
    () => this.openRequest().conversation_userskill.skill.name,
  );

  constructor(private readonly _translateService: TranslateService) {}
}
