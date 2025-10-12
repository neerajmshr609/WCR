import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  input,
  OnInit,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { DropdownListComponent } from '../../../../shared/complex-ui-components/dropdown-list/dropdown-list.component';
import {
  PositionBy,
  Theme,
} from '../../../../shared/complex-ui-components/dropdown-list/dropdown-list.interface';
import { DropdownListItemComponent } from '../../../../shared/UIkit/dropdown-list-item/dropdown-list-item.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { SwitchComponent } from '../../../../shared/switch/switch.component';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConversationMobileMenuViewService } from '../../providers/conversation-mobile-menu-view.service';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropdownListItemComponent, MatCheckbox, SwitchComponent],
  encapsulation: ViewEncapsulation.None,
})
export class MobileMenuComponent
  extends DropdownListComponent<any>
  implements OnInit
{
  public positionBy = input<PositionBy>('bottom');
  public theme = input<Theme>('light');
  public changeView = output<boolean>();
  public viewModeControl = new FormControl();
  private viewModeValueChange =
    this.viewModeControl.valueChanges.pipe(takeUntilDestroyed());
  private conversationMobileMenuViewService = inject(
    ConversationMobileMenuViewService,
  );

  @HostBinding('class')
  get classes() {
    return {
      center: this.alignBy() === 'center',
      right: this.alignBy() === 'right',
      top: this.positionBy() === 'top',
      bottom: this.positionBy() === 'bottom',
      dark: this.theme() === 'dark',
      light: this.theme() === 'light',
    };
  }

  ngOnInit(): void {
    this.changeView.emit(this.getValueFromLocalStorage());
    this.viewModeValueChange.subscribe((value) => {
      this.conversationMobileMenuViewService.updateValue(value);
      this.changeView.emit(value);
    });
    this.viewModeControl.setValue(this.getValueFromLocalStorage());
  }

  private getValueFromLocalStorage(): boolean {
    return this.conversationMobileMenuViewService.getValueFromLocalStorage();
  }
}
