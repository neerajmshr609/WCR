import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconIceBreakerComponent } from '@icons/icon-ice-breaker/icon-ice-breaker.component';

@Component({
  selector: 'app-logo-ice-breaker',
  template: ` <app-icon-ice-breaker
    class="ice-breaker-logo"
  ></app-icon-ice-breaker>`,
  styleUrls: ['./logo-ice-breaker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconIceBreakerComponent],
  standalone: true,
})
export class LogoIceBreakerComponent {}
