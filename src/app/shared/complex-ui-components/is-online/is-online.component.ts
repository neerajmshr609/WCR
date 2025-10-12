import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IconWifiComponent } from '../../icons/icon-wifi/icon-wifi.component';
import { IconWifiOffComponent } from '../../icons/icon-wifi-off/icon-wifi-off.component';

@Component({
  selector: 'app-is-online',
  standalone: true,
  imports: [CommonModule, TranslateModule, IconWifiComponent, IconWifiOffComponent],
  templateUrl: './is-online.component.html',
  styleUrls: ['./is-online.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsOnlineComponent {
  readonly isOnline = input.required<{online?: boolean}>();
}
