import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Skill } from '../../../models/skill.model';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CloseCardButtonComponent } from '../../../UIkit/buttons/close-card-button/close-card-button.component';

@Component({
  selector: 'app-expertise-card',
  templateUrl: './expertise-card.component.html',
  styleUrls: ['./expertise-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TranslateModule, CloseCardButtonComponent],
})
export class ExpertiseCardComponent {
  readonly skill = input.required<Skill>();
  readonly active = input<boolean>(false);

  readonly close = output<void>();
}
