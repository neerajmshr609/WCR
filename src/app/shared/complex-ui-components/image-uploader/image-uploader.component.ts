import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { IFormInput, IFormModel } from '../../../pages/usersettings/interfaces';
import { UserUploadImageService } from '../../../services/upload-image.service';
import { FormControl } from '@angular/forms';
import { ButtonComponent } from '../../UIkit/button/button.component';
import { UploadBtnIconComponent } from '../../icons/upload-btn-icon/upload-btn-icon.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ButtonComponent, UploadBtnIconComponent, TranslateModule],
})
export class ImageUploaderComponent {
  formData = input<IFormInput>();
  save = output<IFormModel>();
  image = input<FormControl | string>('');
  folder = input<string>();

  defaultBg: string = '/assets/user-settings/default-img.svg';

  @ViewChild('avatar', { static: false }) avatar: ElementRef;

  constructor(
    private readonly userUploadImageService: UserUploadImageService,
  ) {}

  uploadAvatar(img: string): void {
    this.save.emit({ value: img, inpName: this.formData().name });
  }

  openUploader(): void {
    this.userUploadImageService.uploadImage(
      this.folder(),
      this.avatar,
      this.uploadAvatar.bind(this),
    );
  }
}
