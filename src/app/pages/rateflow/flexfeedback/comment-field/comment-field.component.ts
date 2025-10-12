import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { RateflowService } from 'src/app/services/rateflow.service';
import { User } from 'src/app/shared/models/user.model';

interface Control extends UntypedFormGroup {
  focus: boolean;
}

@Component({
  selector: 'app-comment-field',
  templateUrl: './comment-field.component.html',
  styleUrls: ['./comment-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommentFieldComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('itemText') itemText: ElementRef;
  @ViewChild('itemLink') itemLink: ElementRef;

  @Input() public control: Control;
  @Input() public tab: any;
  @Input() public feedbackHasDraw: boolean;
  @Input() public feedbackHasScreenshot: boolean;
  @Input() public drawActive: boolean;
  @Input() public index: number;
  @Input() public selectedFile: Projectfile;
  @Input() public author: User;
  @Input() public currentUser: User;

  @Output() public openScreenshotModal = new EventEmitter<void>();
  @Output() public openDrawer = new EventEmitter<void>();
  @Output() public detectPaste = new EventEmitter<ClipboardEvent>();
  @Output() public keyUp = new EventEmitter<Event>();
  @Output() public keyUpLink = new EventEmitter<string>();
  @Output() public deleteItem = new EventEmitter<void>();
  @Output() public deleteScreenshot = new EventEmitter<void>();
  @Output() private recordingStarted = new EventEmitter<void>();
  @Output() private recordingFinished = new EventEmitter<{
    url: string;
    duration: number;
  }>();
  @Output() private keyDownEnter = new EventEmitter<{
    event: Event;
    text: string;
  }>();
  @Output() private valueChanges = new EventEmitter<boolean>();

  public isRecording: boolean;
  public stopRecordingEvt = new EventEmitter<void>();

  constructor(private rateflowService: RateflowService) {
    super();
  }

  ngOnInit(): void {
    this.rateflowService.audioRecordingStarted$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        filter(
          (res) =>
            !(
              res.order === this.index &&
              res.tab === this.tab.name &&
              res.type === 'comment'
            ),
        ),
        tap(() => this.stopRecordingEvt.emit()),
      )
      .subscribe();

    this.control.valueChanges
      .pipe(
        takeUntil(this.destroyed),
        tap(() => {
          this.resizeInputs();
          const res = this.control.getRawValue();
          const isEmpty =
            !res.audio_message?.url &&
            !this.isRecording &&
            !res.text &&
            !res.link &&
            !res.screenshot &&
            !res.screenshotLoading;
          this.valueChanges.emit(isEmpty);
        }),
      )
      .subscribe();

    if (this.control.value.avratingparam_id) {
      setTimeout(() => {
        this.resizeInputs();
      }, 10);
    }
  }

  ngAfterViewInit(): void {
    this.resizeInputs();
  }

  private resizeInputs() {
    if (this.itemText) {
      setTimeout(() => {
        const text = this.itemText.nativeElement;
        if (!text.scrollHeight) {
          return;
        }

        text.style.height = '';
        text.style.height = text.scrollHeight + 'px';
      });
    }

    if (this.itemLink) {
      setTimeout(() => {
        const link = this.itemLink.nativeElement;
        if (!link.scrollHeight) {
          return;
        }

        link.style.height = '';
        link.style.height = link.scrollHeight + 'px';
      });
    }
  }

  public onAudioMsgLangChange(language: string): void {
    const audioControl = this.control.get('audio_message');

    const value = audioControl.value;
    value.language = language;

    audioControl.setValue({ ...value, language });
  }

  public onKeyDownEnter(event: Event, text: string) {
    this.control.focus = false;
    this.keyDownEnter.emit({ event, text });
  }

  public startAudioRecording(event: Event) {
    event.stopPropagation();

    const audioControl = this.control.get('audio_message');
    audioControl.setValue({ ...audioControl.value, recording: true });
    this.isRecording = true;
    this.recordingStarted.emit();
  }

  public audioMessageUploaded(event: {
    url: string;
    duration: number;
    language: string;
  }) {
    this.recordingFinished.emit(event);
    this.isRecording = false;
  }

  public deleteAudioMessage(event: Event) {
    event?.stopPropagation();
    this.control.get('audio_message').reset();
    this.isRecording = false;
    this.keyUp.emit(null);
  }
}
