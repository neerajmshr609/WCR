import { environment } from 'src/environments/environment';
import { UploadResult, Uppy } from '@uppy/core';
import { AwsS3, Dashboard, DropTarget, Url } from 'uppy';
import { EventEmitter, Injectable } from '@angular/core';
import { COMPANION_URL } from 'src/config/config';
import { BehaviorSubject } from 'rxjs';

interface UploaderConfig {
  inline: boolean;
  id: string;
  target: string;
  dropPasteImport?: string;
}

@Injectable({
  providedIn: 'any',
})
export class UploaderService {
  public uploader: Uppy;

  private _uploaderConfig: UploaderConfig;
  public set uploaderConfig(value: UploaderConfig) {
    this._uploaderConfig = this.omitNull({ ...value });
  }

  public filesAdded = new EventEmitter<boolean>();
  public thumbnailGenerated = new EventEmitter<{
    file: any;
    preview: string;
  }>();
  public uploadFinished = new EventEmitter<UploadResult<{}, {}>>();
  public uploadStarted = new EventEmitter<Array<any>>();
  public fileUploaded = new EventEmitter<{ file: any; url: string }>();
  public fileCount = new BehaviorSubject(0);

  private config = { target: Dashboard, companionUrl: COMPANION_URL };

  public get hasFiles(): boolean {
    return !!this.uploader?.getFiles().length;
  }

  public get files(): any {
    return this.uploader?.getFiles() || [];
  }

  public set meta(meta: any) {
    this.uploader.setMeta({ ...meta });
  }

  public set options(options: any) {
    this.uploader.setOptions({ ...options });
  }

  private omitNull(obj: UploaderConfig): UploaderConfig {
    Object.keys(obj)
      .filter((k) => obj[k] == null)
      .forEach((k) => delete obj[k]);
    return obj;
  }

  private generateUniqueId(): string {
    return (
      new Date().valueOf().toString(36) + Math.random().toString(36).substr(2)
    );
  }

  public init(
    options = { hideUploadButton: false },
    source = { Url: true },
  ): void {
    this.uploader = new Uppy({
      id: this._uploaderConfig.id,
      debug: !environment.production,
      autoProceed: false,
      meta: {},
      onBeforeFileAdded: (currentFile, files) => {
        const modifiedFile = {
          ...currentFile,
          name: this.getDateString() + currentFile.name,
        };
        return modifiedFile;
      },
    })
      .use(Dashboard, {
        inline: this._uploaderConfig.inline,
        target: `.${this._uploaderConfig.target}`,
        replaceTargetContent: true,
        showProgressDetails: true,
        width: '100%',
        height: '360px',
        browserBackButtonClose: false,
        proudlyDisplayPoweredByUppy: false,
        closeModalOnClickOutside: true,
        waitForThumbnailsBeforeUpload: true,
        showLinkToFileUploadResult: false,
        hideUploadButton: options.hideUploadButton,
        locale: {
          strings: {
            ...(this._uploaderConfig.dropPasteImport && {
              dropPasteImport: this._uploaderConfig.dropPasteImport,
            }),
          },
        },
      })
      // .use(GoogleDrive, this.config)
      // .use(Dropbox, this.config)
      // .use(Instagram, this.config)
      // .use(Facebook, this.config)
      // .use(OneDrive, this.config)
      // .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' })
      .use(AwsS3, {
        target: Dashboard,
        companionUrl: COMPANION_URL,
        metaFields: ['folder'],
      })
      .use(DropTarget, { target: document.body });

    if (source.Url) {
      this.uploader.use(Url, this.config);
    }

    this.uploader.on('upload', () => {
      this.files.forEach(
        (file) => (file.meta.name = file.meta.id + '.' + file.extension),
      );
      this.uploadStarted.emit(this.files);
    });
    this.uploader.on('files-added', (files) => {
      files.forEach((f) =>
        this.uploader.setFileMeta(f.id, { id: this.generateUniqueId() }),
      );
      this.filesAdded.emit(true);
      this.fileCount.next(this.fileCount.value + files.length);
    });
    this.uploader.on('file-removed', (files) => {
      this.fileCount.next(this.fileCount.value - 1);
      if (this.fileCount.value === 0) {
        this.filesAdded.emit(false);
      }
    });
    this.uploader.on('thumbnail:generated', (file, preview) =>
      this.thumbnailGenerated.emit({ file, preview }),
    );
    this.uploader.on('complete', (result) => this.uploadFinished.emit(result));
    this.uploader.on('upload-success', (file, response) =>
      this.fileUploaded.emit({
        file,
        url: decodeURIComponent(response.uploadURL),
      }),
    );
  }

  public uploadFiles(): Promise<{ successful; failed }> {
    return this.uploader.upload().then((result: UploadResult) => {
      if (result.failed.length > 0) {
        result.failed.forEach((file) => console.error(file.error));
      }

      return { successful: result.successful, failed: result.failed };
    });
  }

  public openModal(): void {
    this.init();
    (this.uploader.getPlugin('Dashboard') as any).openModal();
  }

  public closeModal(): void {
    (this.uploader.getPlugin('Dashboard') as any).closeModal();
  }

  public destroy(): void {
    if (!this.uploader) {
      return;
    }

    this.uploader.off('upload', () => {
    });
    this.uploader.off('files-added', () => {
    });
    this.uploader.off('thumbnail:generated', () => {
    });
    this.uploader.off('file-removed', () => {
    });
    this.uploader.off('complete', () => {
    });
    this.uploader.off('upload-success', () => {
    });

    this.uploader.close();
    this.uploader = null;
  }

  private getDateString(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const time = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
    return `${year}${month}${day}${time}`;
  }
}
