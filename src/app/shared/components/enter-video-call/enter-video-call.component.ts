import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@ui-kit/button/button.component';
import { IconVideoCallComponent } from '@icons/icon-video-call/icon-video-call.component';
import { SmallSpinnerModule } from '../small-spinner/small-spinner.module';
import { fadeInUpAnimation } from 'angular-animations';
import { IconCapsuleClosedComponent } from '@icons/icon-capsule-closed/icon-capsule-closed.component';
import { CloseCardIconComponent } from '@icons/close-card-icon/close-card-icon.component';

@Component({
  selector: 'app-enter-video-call',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonComponent,
    IconVideoCallComponent,
    SmallSpinnerModule,
    CloseCardIconComponent,
  ],
  templateUrl: './enter-video-call.component.html',
  styleUrls: ['./enter-video-call.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterVideoCallComponent {
  public join = output();
  public close = output();
  public loading = input<boolean>(false);
  public inProgress = input<boolean>(false);
  public finished = input<boolean>(false);

  public goJoin(): void {
    if (!this.loading() || !this.inProgress() || !this.finished()) {
      this.join.emit();
    }
  }
}
