import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-desktop-header',
  templateUrl: './desktop-header.component.html',
  styleUrls: ['./desktop-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopHeaderComponent {
  public title = input.required<string>();
  public subtitle = input.required<string>();
}
