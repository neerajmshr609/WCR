import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AimedHeartIconComponent } from '../../icons/aimed-heart-icon/aimed-heart-icon.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome-card',
  templateUrl: './welcome-card.component.html',
  styleUrls: ['./welcome-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AimedHeartIconComponent, TranslateModule],
  standalone: true,
})
export class WelcomeCardComponent {}
