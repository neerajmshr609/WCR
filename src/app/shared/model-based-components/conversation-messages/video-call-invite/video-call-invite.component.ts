import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@ui-kit/button/button.component';
import { IconVideoCallComponent } from '@icons/icon-video-call/icon-video-call.component';
import { Lesson } from '../../../models/lesson.model';

@Component({
  selector: 'app-video-call-invite',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonComponent,
    IconVideoCallComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-call-invite.component.html',
  styleUrls: ['./video-call-invite.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VideoCallInviteComponent {
  public isSender = input<boolean>(false);
  public meet = input<Lesson>();
  public hostName = input<string>('');
  public enterMeet = output<Lesson>();

  public joined = computed(() => {
    return this.meet()?.status === 'process';
  });

  constructor() {}

  public accept(): void {
    if (!this.meet()?.finished && this.meet()?.status !== 'process') {
      this.enterMeet.emit(this.meet());
    }
  }
}
