import { ElementRef, Injectable } from '@angular/core';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';

@Injectable({
  providedIn: 'any',
})
export class UserUploadImageService {
  constructor(private uploaderService: UploaderService) {}

  public uploadImage(
    folder: string,
    avatar: ElementRef,
    saveImg: (img: string) => void,
  ) {
    this.uploaderService.openModal();

    this.uploaderService.meta = {
      folder: folder,
    };

    this.uploaderService.options = {
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif'],
      },
    };

    const subscription = this.uploaderService.uploadFinished.subscribe(
      (res) => {
        const decodedUrl = decodeURIComponent(res.successful[0].uploadURL);

        if (avatar && avatar.nativeElement) {
          avatar.nativeElement.src = decodedUrl;
        }

        this.uploaderService.closeModal();

        saveImg(decodedUrl);
        subscription.unsubscribe();
      },
    );
  }
}
