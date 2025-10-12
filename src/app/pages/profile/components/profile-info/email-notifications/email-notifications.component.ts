import { ChangeDetectionStrategy, Component, effect } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-email-notifications',
  templateUrl: './email-notifications.component.html',
  styleUrls: ['./email-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailNotificationsComponent {
  readonly isMuted = toSignal(this._profileService.publicProfile$.pipe(map(_ => !!_?.conversations_muted)));
  readonly notificationMutedControl = new FormControl<boolean>(this.isMuted());
  readonly controlValueChange = toSignal(this.notificationMutedControl.valueChanges);

  constructor(
    private readonly _profileService: ProfileService,
  ) {
    effect(() => {
      this.notificationMutedControl.setValue(this.isMuted());
    });
    effect(() => {
      const controlValue = this.controlValueChange();
      this._setIsMutedTo(controlValue);
    }, { allowSignalWrites: true });
  }

  private _setIsMutedTo(value: boolean) {
    if (value !== this.isMuted()) {
      this._profileService.updateIsMuted(value);
    }
  }
}
