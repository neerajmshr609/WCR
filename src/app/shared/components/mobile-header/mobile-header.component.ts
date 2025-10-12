import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileHeaderComponent {
  public title = input.required<string>();
  public subtitle = input.required<string>();
}
