import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { User } from 'src/app/shared/models/user.model';
import { ClientForm, IFormModel } from '../../interfaces';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFormComponent extends BaseComponent {
  currentUser = input<User>();
  form = input<UntypedFormGroup>();
  avatars = input<string[]>();
  formData = input<ClientForm>();

  selectAvatar = output<string>();
  openUploader = output<string>();
  changeEmail = output();

  folder = computed(() => 'users/' + this.currentUser()?.id + '/profile');

  constructor() {
    super();
  }

  changeAvatar(avatar: string): void {
    this.selectAvatar.emit(avatar);
  }

  uploadAvatar(avatar: IFormModel): void {
    this.openUploader.emit(avatar.value as string);
  }

  updateEmail(): void {
    this.changeEmail.emit();
  }
}
