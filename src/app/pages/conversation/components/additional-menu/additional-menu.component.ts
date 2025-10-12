import { trigger, style, transition, animate } from '@angular/animations';
import {
  Component,
  input,
  model,
  output,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CloseIconComponent } from 'src/app/shared/icons/close-icon/close-icon.component';
import { ScannerIconComponent } from 'src/app/shared/icons/scanner-icon/scanner-icon.component';
import { FileIconComponent } from 'src/app/shared/icons/file-icon/file-icon.component';
import { CameraIconComponent } from 'src/app/shared/icons/camera-icon/camera-icon.component';
import { LocationIconComponent } from 'src/app/shared/icons/location-icon/location-icon.component';
import { PillIconComponent } from 'src/app/shared/icons/pill-icon/pill-icon.component';
import { ImageIconComponent } from 'src/app/shared/icons/image-icon/image-icon.component';
import { ContactIconComponent } from 'src/app/shared/icons/contact-icon/contact-icon.component';
import { SendIconComponent } from 'src/app/shared/icons/send-icon/send-icon.component';
import { DollarIconComponent } from 'src/app/shared/icons/dollar-icon/dollar-icon.component';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';

import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-additional-menu',
  standalone: true,
  imports: [
    DollarIconComponent,
    ImageIconComponent,
    ScannerIconComponent,
    FileIconComponent,
    CameraIconComponent,
    LocationIconComponent,
    PillIconComponent,
    ContactIconComponent,
    CloseIconComponent,
    SendIconComponent,
    TranslateModule,
  ],
  templateUrl: './additional-menu.component.html',
  styleUrl: './additional-menu.component.scss',
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ opacity: 0.5, height: 0 }),
        animate(300, style({ opacity: 1.0, height: '193px' })),
      ]),
      transition(':leave', [animate(300, style({ opacity: 0.5, height: 0 }))]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalMenuComponent {
  public isSendingFile = model(false);

  public isUploadFile = model(false);
  public send = output<boolean>();
  public conversationId = input<number>();

  public isDisplayAdditionalMenu = model(false);

  public addedFiles = toSignal(this.uploaderService.filesAdded.asObservable(), {
    initialValue: false,
  });

  constructor(private uploaderService: UploaderService) {
    effect(() => {
      if (this.isUploadFile()) {
        setTimeout(() => {
          this.initFileUploader();
        });
      }
    });
  }

  public closeAdditionalMenu(): void {
    this.isDisplayAdditionalMenu.set(false);
    this.isUploadFile.set(false);
  }

  public sendFiles(): void {
    this.send.emit(true);
  }

  private initFileUploader(): void {
    const id = 'uploader--conversation-file';
    this.uploaderService.uploaderConfig = {
      id,
      target: id,
      inline: true,
      dropPasteImport:
        'You can upload one or multiple files including images, audio, video and PDF. Just drop files here, paste, %{browse} or import from:',
    };
    this.uploaderService.init({ hideUploadButton: true }, { Url: false });
    this.uploaderService.meta = {
      folder: `conversations/${this.conversationId()}`,
    };
  }
}
