import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../../shared/UIkit/input/input.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SharedModule } from '../../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  PRIVACY_POLICY_ROUTE,
  TERMS_OF_SERVICE_ROUTE,
} from '../../../../../config/shared-routes';
import { InviteUserRole } from '../../../../shared/models/user.model';
import { ButtonComponent } from '../../../../shared/UIkit/button/button.component';
import { SearchComponent } from '../../../../shared/UIkit/search/search.component';
import { SelectComponent } from '../../../../shared/UIkit/select/select.component';
import { PlusIconComponent } from '../../../../shared/icons/plus-icon/plus-icon.component';

@Component({
  selector: 'app-invite-popup',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    MatButton,
    MatIcon,
    SharedModule,
    TranslateModule,
    ButtonComponent,
    SearchComponent,
    SelectComponent,
    PlusIconComponent,
  ],
  templateUrl: './invite-popup.component.html',
  styleUrls: ['./invite-popup.component.scss'],
})
export class InvitePopupComponent {
  readonly TERMS_OF_SERVICE_ROUTE = TERMS_OF_SERVICE_ROUTE;
  readonly PRIVACY_POLICY_ROUTE = PRIVACY_POLICY_ROUTE;
  readonly addUserForm = new FormGroup<{
    email: FormControl;
    role: FormControl;
  }>({
    role: new FormControl<string>(null, [Validators.required]),
    email: new FormControl<string>(null, [
      Validators.required,
      Validators.email,
    ]),
  });
  public userRoles = signal<{ name: InviteUserRole }[]>([]);
  public organization = signal<string>(null);

  constructor(
    private readonly _dialogRef: MatDialogRef<InvitePopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: {
      roles: { name: InviteUserRole; title: string }[];
      organization: string;
    },
  ) {
    this.userRoles.set(_data.roles);
    this.organization.set(_data.organization);
  }

  close() {
    this._dialogRef.close();
  }

  cancel() {
    this._dialogRef.close();
  }

  add() {
    this._dialogRef.close(this.addUserForm.value);
  }
}
