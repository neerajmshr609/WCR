import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  output,
  input,
  signal,
  HostListener,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { MoreMenuComponent } from '../../../../../shared/more-menu/more-menu.component';
import { UserIconComponent } from '../../../../../shared/icons/user-icon/user-icon.component';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { IFormInput } from '../../../interfaces';
import { USER_PERMISSIONS } from '../../../constants/forms';
import { MatIcon } from '@angular/material/icon';
import { IRegisteredUser } from 'src/app/shared/models/user.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputComponent } from 'src/app/shared/UIkit/input/input.component';
import { SwitchComponent } from 'src/app/shared/switch/switch.component';
import { SelectComponent } from 'src/app/shared/UIkit/select/select.component';
import { TabsComponent } from 'src/app/shared/UIkit/tabs/tabs.component';
import { USER_PERMISSIONS_TABS } from '../../../constants/user-permission-tabs';
import { UserApproveIconComponent } from 'src/app/shared/icons/user-approve-icon/user-approve-icon.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserPermissionsService } from '../../../services/user-permissions.service';
import { UsersService } from 'src/app/services/users.service';
import { getRandomAvatarSrc } from '../../../constants/avatars';

@Component({
  selector: 'app-user-accordion',
  templateUrl: './user-accordion.component.html',
  styleUrls: ['./user-accordion.component.scss'],
  imports: [
    NgClass,
    MoreMenuComponent,
    UserIconComponent,
    MatIcon,
    TranslateModule,
    InputComponent,
    SwitchComponent,
    SelectComponent,
    TabsComponent,
  ],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAccordionComponent implements OnInit {
  expand = output<number>();
  approveEvent = output<IRegisteredUser>();
  user = input<IRegisteredUser>();

  accordionInpIsChecked = signal<boolean>(false);
  hasPermissions = signal<boolean>(false);
  actionList = computed(() => {
    if (
      this.user().state === 'pending' ||
      this.user().free_consultants_status === 'pending'
    ) {
      return [
        // {
        //   title: 'delete_user',
        //   icon: DeleteIconComponent,
        //   event: this.deleteUser,
        // },
        // {
        //   title: 'suspend_user',
        //   icon: VisibilityHiddenIconComponent,
        //   event: this.suspendUser,
        // },
        {
          title: 'approve_user',
          icon: UserApproveIconComponent,
          event: () => this.approveUser(),
        },
      ];
    }
  });
  form: FormGroup;
  formData: IFormInput[] = USER_PERMISSIONS;
  tabs = USER_PERMISSIONS_TABS;
  selected = 0;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private permissionsService: UserPermissionsService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private userService: UsersService,
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest(`.idx${this.user().id}`)) {
      this.accordionInpIsChecked.set(false);
    }
  }

  ngOnInit() {
    if (this.user()) {
      this.hasPermissions.set(true);
      this.form = new FormGroup(this.setFormInputs(this.user().permissions));
      this.subscribeToForm();
    }
  }

  deleteUser(): void {}

  suspendUser(): void {}

  approveUser(): void {
    if (this.user().state === 'pending') {
      this.userService
        .approvePendingUser({ ...this.user(), state: 'approved' })
        .subscribe((res: any) => {
          this.approveEvent.emit({ ...this.user(), state: 'approved' });
        });
    }

    if (this.user().free_consultants_status === 'pending') {
      const approved = {
        ...this.user(),
        status: 'approved',
        user_id: this.user().id,
      };
      this.userService.updateUser(approved).subscribe((res) => {
        this.approveEvent.emit(approved);
      });
    }
  }

  private subscribeToForm(): void {
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.get(controlName);

      if (control) {
        control.valueChanges.pipe(debounceTime(1000)).subscribe((checked) => {
          if (checked) {
            this.permissionsService
              .createUserPermissions(controlName, this.user().id)
              .subscribe(() =>
                this.translate
                  .get('permissions.permission_added')
                  .subscribe((message) => {
                    this.snackBar.open(message, null, {
                      duration: 1000,
                    });
                  }),
              );
          } else {
            this.permissionsService
              .deleteUserPermissions(controlName, this.user().id)
              .subscribe(() =>
                this.translate
                  .get('permissions.permission_removed')
                  .subscribe((message) => {
                    this.snackBar.open(message, null, {
                      duration: 1000,
                    });
                  }),
              );
          }
        });
      }
    });

    this.changeDetectorRef.detectChanges();
  }

  private setFormInputs(permissions: string[]) {
    const _formObj = {};

    this.formData.map((value) => {
      _formObj[value.name] = new FormControl(
        permissions.includes(value.name) ??
          (value.type === 'switch' ? value.checked : ''),
      );
    });

    return _formObj;
  }

  toggle(event): void {
    if (this.hasPermissions()) {
      this.accordionInpIsChecked.set(event.target.checked);
      this.expand.emit(event.target.checked ? this.user().id : 0);
    }
  }

  selectTab(tab): void {
    this.selected = tab;
  }

  public getRandomAvatar(id = 0) {
    return getRandomAvatarSrc(id);
  }
}
