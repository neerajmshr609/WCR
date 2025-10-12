import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OutletService } from '../../../../services/outlet.service';

@Component({
  selector: 'app-header-nav-bar-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './header-nav-bar-item.component.html',
  styleUrls: ['./header-nav-bar-item.component.scss'],
})
export class HeaderNavBarItemComponent {
  public link = input<unknown[] | string>();
  public queryParams = input<{ [key: string]: string }>();
  public title = input.required<string>();
  readonly routerLinkActive = computed(() => (this.link() ? 'active' : ''));
  private readonly _currentRoute = toSignal(this._outletService.currentUrl$);
  readonly navigateUrl = computed(() => this.link() || this._currentRoute());

  constructor(private readonly _outletService: OutletService) {}
}
