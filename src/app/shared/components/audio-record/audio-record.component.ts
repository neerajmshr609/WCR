import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  input,
  Input,
  OnDestroy,
  OnInit,
  output,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { delay, filter, take, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { AudioRecordingService } from 'src/app/services/audio-recorder';
import { ANON_USER_ID, COMPANION_URL } from 'src/config/config';
import { Uppy } from '@uppy/core';
import { AwsS3 } from 'uppy';
import { User } from '../../models/user.model';
import { BaseComponent } from '../base.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-audio-record',
  templateUrl: './audio-record.component.html',
  styleUrls: ['./audio-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class AudioRecordComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  @ViewChild('messageInput') private messageInput: ElementRef;
  @ViewChild('marqueeRef') private marqueeRef: ElementRef;

  @Input() public user: User;
  @Input() public messageTitle: string;
  @Input() public sendBtnSrc = 'assets/icons/send.svg';
  @Input() public isFlexFeedback = false;
  @Input() private audioError$: Observable<boolean>;
  @Input() private stopRecording$: Observable<void>;

  @Output() private uploadingFinished = new EventEmitter<{}>();
  @Output() private error = new EventEmitter<void>();
  @Output() private close = new EventEmitter<void>();
  public startUpload = output<{
    title: string;
    duration: number;
    language: string;
    fileName: string;
    blob: Blob;
  }>();
  public hasHost = input(false);

  public recordedTime$ = new BehaviorSubject<number>(0);
  public isRecordingPaused: boolean;
  public isRecordingStopped: boolean;
  public isAudioMessageUploading: boolean;

  private audioMessageTitle: string;

  private uploader = new Uppy({ id: 'audiomessage-uploader' }).use(AwsS3, {
    companionUrl: COMPANION_URL,
    metaFields: ['folder'],
  });

  private withoutTitle: boolean;
  private isMobile: boolean;

  public showAnimation: boolean;
  public textPlaceholder: string;

  public get isStopped(): boolean {
    return this.isRecordingStopped || this.isAudioMessageUploading;
  }

  public get isCollapsed(): boolean {
    return this.isFlexFeedback || this.isMobile;
  }

  public get inputTitle(): string {
    return this.isCollapsed
      ? 'audio_record.add_title'
      : 'audio_record.write_title';
  }

  constructor(
    private audioRecordingService: AudioRecordingService,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private readonly _translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.startAudioRecord();

    this.audioError$
      ?.pipe(
        takeUntil(this.destroyed),
        filter((res) => res),
        tap(() => {
          this.showAnimation = true;
          this._translateService
            .get('audio_record.error_uploading')
            .pipe(take(1))
            .subscribe((_) => {
              this.textPlaceholder = _;
            });
        }),
      )
      .subscribe();

    this.breakpointObserver
      .observe('(max-width: 500px)')
      .pipe(
        takeUntil(this.destroyed),
        tap((state) => (this.isMobile = state.matches)),
      )
      .subscribe();

    this.stopRecording$
      ?.pipe(
        takeUntil(this.destroyed),
        tap(() => {
          this.getAudioMessageTitle();
          this.audioRecordingService.stopRecording();
        }),
      )
      .subscribe();
  }

  onInputFocus() {
    const value = this.messageInput.nativeElement.value;
    this._translateService
      .get(this.inputTitle)
      .pipe(take(1))
      .subscribe((_) => {
        this.messageInput.nativeElement.value = value === _ ? '' : value;
      });
  }

  handleMarquee() {
    const marquee = this.marqueeRef.nativeElement;
    const speed = 1;

    const container: HTMLElement = marquee.querySelector('.inner');
    const content: HTMLElement = marquee.querySelector('.inner > *');
    const elWidth = content.offsetWidth;
    const clone = content.cloneNode(true);
    container.appendChild(clone);
    let progress = 1;

    function loop() {
      progress = progress - speed;

      if (progress <= elWidth * -1) {
        progress = 0;
      }

      container.style.transform = 'translateX(' + progress + 'px)';
      container.style.transform += ' skewX(' + speed * 0.4 + 'deg)';
      window.requestAnimationFrame(loop);
    }

    loop();
  }

  startAudioRecord() {
    this.showAnimation = true;
    this.textPlaceholder = this.user.lang
      ? `Talk in: ${this.user.lang.split(',').join(', ')} `
      : 'Talk in English';
    this.isRecordingPaused = false;
    this.audioRecordingService.startRecording();

    setTimeout(() => {
      const messagePlaceholderElement: HTMLElement =
        this.marqueeRef.nativeElement;
      const isOverflown =
        messagePlaceholderElement.scrollWidth >
        messagePlaceholderElement.clientWidth;
      if (isOverflown) {
        this.handleMarquee();
      }
    });

    forkJoin([
      this.audioRecordingService.recordingFail$.pipe(
        tap(() => this.error.emit()),
      ),
      this.audioRecordingService.recordedTime$.pipe(
        tap((time) => this.recordedTime$.next(time)),
      ),
      this.audioRecordingService.recordedBlob$.pipe(
        tap((data) => {
          this.startUpload.emit({
            blob: data.blob,
            title: this.audioMessageTitle,
            duration: data.duration,
            language: this.getAudioLanguage(),
            fileName: data.title,
          });
          // TODO need refactor for using this component (conversation detail component host for this component and call  uploadAudioMessage method )
          if (!this.hasHost()) {
            this.uploadAudioMessage(
              data.blob,
              data.title,
              data.duration,
              data.title,
            );
          }
        }),
      ),
    ])
      .pipe(takeUntil(this.destroyed))
      .subscribe();
  }

  private getAudioLanguage(): string {
    const languages =
      this.audioRecordingService.createArrayOfAvailableLanguages(
        this.user.lang,
      );
    return this.audioRecordingService.getLastUsedLanguage(languages);
  }

  public deleteRecording(close = false) {
    this.audioRecordingService.abortRecording();

    if (close) {
      this.close.emit();
    }
  }

  private async uploadAudioMessage(
    blob: Blob,
    title: string,
    duration: number,
    fileName: string,
  ) {
    const uploadedFile = await this.useUploader(blob, title);
    this.uploadingFinished.emit({
      title: this.audioMessageTitle,
      url: decodeURIComponent(uploadedFile.successful[0].uploadURL),
      duration,
      name: fileName,
      language: this.getAudioLanguage(),
    });
  }

  private async useUploader(blob: Blob, title: string) {
    this.uploader.addFile({
      data: blob,
      name: title,
      source: 'file input',
      type: blob.type,
    });
    const userId = this.authService.userSubject$.value?.id || ANON_USER_ID;
    this.uploader.setMeta({ folder: `users/${userId}/audio-messages` });

    const uploadedFile = await this.uploader.upload();
    this.uploader.reset();
    return uploadedFile;
  }

  public stopAudioRecord(withoutTitle = false) {
    if (this.isAudioMessageUploading) {
      return;
    }

    if (this.isRecordingStopped || this.isFlexFeedback) {
      this.withoutTitle = withoutTitle;
      this.isRecordingPaused = false;
      this.isAudioMessageUploading = true;
      this.getAudioMessageTitle();

      this.audioRecordingService.stopRecording();
      return;
    }
    this.pauseAudioRecord();
    this.showAudioMessageTitle();
  }

  public pauseAudioRecord() {
    this.isRecordingPaused = true;
    this.showAnimation = false;
    this.textPlaceholder = 'audio_record.paused';
    this.audioRecordingService.pauseRecording();
  }

  private setInputPlaceholderAnimation() {
    const uploadingStrInfo = [
      'audio_record.uploading',
      'audio_record.uploading_1_dot',
      'audio_record.uploading_2_dot',
      'audio_record.uploading_3_dot',
    ];

    let strIndex = 0;
    const getNextStr = () => {
      if (strIndex === uploadingStrInfo.length) {
        strIndex = 0;
      }
      return uploadingStrInfo[strIndex++];
    };

    this.showAnimation = false;
    this.textPlaceholder = 'audio_record.uploading';
    // TODO: Remove timers
    setInterval(() => {
      setTimeout(() => {
        this._translateService
          .get(getNextStr())
          .pipe(take(1))
          .subscribe((_) => {
            this.textPlaceholder = _;
          });
      });
    }, 300);
  }

  private getAudioMessageTitle() {
    this.isAudioMessageUploading = true;
    if (this.messageInput) {
      this.messageInput.nativeElement.classList.remove('add-title');
      const text = this.messageInput.nativeElement.value;
      this._translateService
        .get(this.inputTitle)
        .pipe(take(1))
        .subscribe((_) => {
          this.audioMessageTitle = text === _ || this.withoutTitle ? '' : text;
        });
    }

    this.isRecordingStopped = false;
    this.cdr.detectChanges();
    this.setInputPlaceholderAnimation();
  }

  private showAudioMessageTitle() {
    this.isRecordingStopped = true;
    this.audioMessageTitle = '';

    this._translateService
      .get(['audio_record.add_title', 'audio_record.write_title'])
      .pipe(take(1), delay(100))
      .subscribe((translates) => {
        const placeholder = translates[this.inputTitle];
        this.messageInput.nativeElement.setAttribute(
          'placeholder',
          placeholder,
        );
        if (this.messageTitle) {
          this.messageInput.nativeElement.value = this.messageTitle;
        }
        this.messageInput.nativeElement.classList.add('add-title');
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.deleteRecording();
  }
}
