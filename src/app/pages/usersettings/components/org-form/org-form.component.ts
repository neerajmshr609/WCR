import { Component, computed, input, output } from '@angular/core';
import { IFormModel, IOrganization } from '../../interfaces';
import { UntypedFormGroup } from '@angular/forms';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';

@Component({
  selector: 'app-org-form',
  templateUrl: './org-form.component.html',
  styleUrls: ['./org-form.component.scss'],
})
export class OrgFormComponent {
  orgatizationData = input<IOrganization>();
  form = input<UntypedFormGroup>();
  avatars = input<string[]>();
  formData = input();

  selectAvatar = output<string>();
  openUploader = output<string>();
  changeEmail = output();

  folder = computed(
    () => 'organizations/' + this.orgatizationData()?.id + '/bg-image',
  );

  constructor(private readonly uploaderService: UploaderService) {
    this.uploaderService.uploaderConfig = {
      id: 'uploader--organizations-avatar',
      target: 'uploader--organizations-avatar',
      inline: false,
    };
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
