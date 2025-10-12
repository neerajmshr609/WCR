import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  Signal,
  signal,
} from '@angular/core';
import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MarkIconComponent } from '../../icons/mark-icon/mark-icon.component';
import { SettingsIconComponent } from '../../icons/settings-icon/settings-icon.component';
import { ResizeService } from '../../../services/resize.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConversationType } from '../../models/conversation.model';
import { ConversationFilterItem } from '../../models/conversation-filter-item';
import { RequestIconComponent } from '../../icons/request-icon/request-icon.component';
import { CommunitiesIconComponent } from '../../icons/communities-icon/communities-icon.component';
import { OrganizationIconComponent } from '../../icons/organization-icon/organization-icon.component';
import { GetSupportIconComponent } from '../../icons/get-support-icon/get-support-icon.component';
import { WeCareIconComponent } from '../../icons/we-care-icon/we-care-icon.component';
import { MessageIconComponent } from '../../icons/message-icon/message-icon.component';
import { TimeIconComponent } from '../../icons/time-icon/time-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  bounceInDownOnEnterAnimation,
  bounceInLeftOnEnterAnimation,
  bounceInRightOnEnterAnimation,
  bounceOutLeftOnLeaveAnimation,
  bounceOutRightOnLeaveAnimation,
  bounceOutUpOnLeaveAnimation,
} from 'angular-animations';

@Component({
  selector: 'app-type-multi-select',
  templateUrl: './type-multi-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrls: ['./type-multi-select.component.scss'],
  imports: [
    NgClass,
    MarkIconComponent,
    SettingsIconComponent,
    AsyncPipe,
    RequestIconComponent,
    CommunitiesIconComponent,
    OrganizationIconComponent,
    GetSupportIconComponent,
    WeCareIconComponent,
    MessageIconComponent,
    TimeIconComponent,
    NgTemplateOutlet,
    TranslateModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TypeMultiSelectComponent),
    },
  ],
  animations: [
    bounceInRightOnEnterAnimation(),
    bounceOutRightOnLeaveAnimation(),
    bounceInDownOnEnterAnimation(),
    bounceOutUpOnLeaveAnimation(),
  ],
})
export class TypeMultiSelectComponent implements ControlValueAccessor {
  public items = input<ConversationFilterItem[]>();

  public openList = signal(false);
  public selected = signal<ConversationFilterItem[]>([]);
  public isDisabled = signal(false);
  public touched = signal(false);
  public isDesktop!: Signal<boolean>;
  public readonly types = ConversationType;

  constructor(private resizeService: ResizeService) {
    this.isDesktop = toSignal(this.resizeService.isDesktop$);
  }

  public onChange = (selected: ConversationFilterItem[]) => {};

  public onTouched = () => {};

  public registerOnChange(fn): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  public markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched.set(true);
    }
  }

  public writeValue(selected: ConversationFilterItem[]): void {
    this.selected.set(selected);
  }

  public select(value: ConversationFilterItem): void {
    value.selected = !value.selected;

    if (value.selected) {
      this.selected.update((selected) => [
        ...(!!selected ? selected : []),
        value,
      ]);
    } else {
      this.selected.update((selected) => {
        const seletedIndex = selected.indexOf(
          selected.find((v) => value.name === v.name),
        );
        selected.splice(seletedIndex, 1);
        return [...(!!selected ? selected : [])];
      });
    }

    this.onChange(this.selected());
  }

  public switchItems(): void {
    this.openList.set(!this.openList());
  }
}
