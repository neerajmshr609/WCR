import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UrlModalComponent } from '../url-modal/url-modal.component';
import { distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { User } from 'src/app/shared/models/user.model';
import { AudioMessage } from 'src/app/shared/models/message.model';
import { RateflowService } from 'src/app/services/rateflow.service';
import { avFileStateEnum, avYTStateEnum } from 'src/app/shared/enums';
import { AVRatingParam } from 'src/app/shared/models/avratingparam.model';
import { Feedback } from 'src/app/shared/models/feedback.model';
import { Project } from 'src/app/shared/models/project.model';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { insertString } from 'src/app/shared/functions/insert-string';

@Component({
  selector: 'app-av-pane',
  templateUrl: './av-pane.component.html',
  styleUrls: ['./av-pane.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AvPaneComponent extends BaseComponent implements OnInit {
  @ViewChild('commentInput') commentInput: ElementRef;

  @Input() selectedFileDidChange$: BehaviorSubject<Projectfile>;
  @Input() project: Project;
  @Input() public author: User;
  @Input() public noAvParams: boolean;

  @Output() avfeedbackUpdate = new EventEmitter<Feedback>();

  private selectedFileID: string;
  public showWarning: boolean;

  currentTrackposition = 0;
  currentXposition = 0;
  numberOfEmptySliders: Array<number>;
  recordingEnabled = false;

  playState: avFileStateEnum | avYTStateEnum;
  selectedFile: Projectfile;
  activeAVParam: AVRatingParam;

  public isRecording: boolean;
  public audioMessage: AudioMessage;
  public stopRecordingEvt = new EventEmitter<void>();

  public get hasActiveParam(): boolean {
    return this.selectedFile?.avratingparams.some((p) => p.active);
  }

  constructor(
    private rateflowService: RateflowService,
    private dialog: MatDialog,
  ) {
    super();
  }

  sliderDidChange(avparam: AVRatingParam, newValue: number) {
    const fileID = this.selectedFileID;
    this.rateflowService.avSliderDidSlide$.next({
      fileID,
      param: avparam,
      value: newValue,
    });
  }

  ngOnInit() {
    this.selectedFileDidChange$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res?.avratingparams?.length),
      )
      .subscribe((res) => {
        this.selectedFile = res;
        this.selectedFileID = res.id;

        this.activeAVParam = this.selectedFile.avratingparams[0];
        this.numberOfEmptySliders = Array(
          3 - this.selectedFile.avratingparams.length,
        ).fill(0);

        const playingFile = this.rateflowService.avFileStateChange$.value;
        this.updateState(
          this.selectedFileID === playingFile?.fileIDString
            ? playingFile.state
            : 2,
        );
      });

    this.rateflowService.audioRecordingStarted$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => res && res.type !== 'av'),
        tap(() => this.stopRecordingEvt.emit()),
      )
      .subscribe();

    this.rateflowService.trackpositionUpdated$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => res != null),
      )
      .subscribe((currentTrackposition) => {
        this.currentTrackposition = currentTrackposition;
      });

    this.rateflowService.avFileStateChange$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => this.selectedFileID === res?.fileIDString),
        distinctUntilChanged(
          (state, prevState) => state.state === prevState.state,
        ),
      )
      .subscribe((res) => this.updateState(res.state));

    this.showWarning = +localStorage.getItem('commentsCount') < 5;
  }

  updateState(state: avFileStateEnum | avYTStateEnum) {
    if (state == null) {
      return;
    }

    this.playState = state;

    if (
      this.selectedFile.kind === 'video' ||
      this.selectedFile.kind === 'audio'
    ) {
      switch (state) {
        case avFileStateEnum.paused:
          this.showPlaybackReady();
          return;

        case avFileStateEnum.playing:
          this.recordingEnabled = true;
          this.showPlaybackPauseOption();
          return;

        case avFileStateEnum.notloaded:
          this.showFileLoading();
          return;

        case avFileStateEnum.loaded:
          this.showPlaybackReady();
          return;
      }
    }

    if (this.selectedFile.mimetype === 'video/youtube') {
      switch (state) {
        case avYTStateEnum.paused:
          this.showPlaybackReady();
          this.setAutoFocus();
          return;

        case avYTStateEnum.ended:
          this.showPlaybackReady();
          return;

        case avYTStateEnum.playing:
          this.recordingEnabled = true;
          this.showPlaybackPauseOption();
          this.removeFocus();
          return;

        case avYTStateEnum.buffering:
          this.showFileLoading();
          return;

        case avYTStateEnum.unstarted:
          this.showPlaybackReady();
          return;
      }
    }
  }

  showPlaybackPauseOption() {
    const image = document.querySelector(
      '.typeimage-av-v2',
    ) as HTMLImageElement;
    image.src = 'assets/flexfeedback/av-menu-active-v2-paused.svg';
    image.classList.remove('pulse');
  }

  showFileLoading() {
    const image = document.querySelector(
      '.typeimage-av-v2',
    ) as HTMLImageElement;
    image.src = 'assets/flexfeedback/av-menu-active-v2-loading.svg';
    image.classList.remove('pulse');
  }

  showPlaybackReady() {
    const image = document.querySelector(
      '.typeimage-av-v2',
    ) as HTMLImageElement;
    image.src = 'assets/flexfeedback/av-menu-active-v2-armed.svg';
  }

  colorForActiveParam() {
    if (!this.hasActiveParam) {
      return '#757575';
    }
    const color = this.rateflowService.colorFromString(
      this.activeAVParam.color,
    );
    return color;
  }

  colorForParam(param: AVRatingParam) {
    const color = this.rateflowService.colorFromString(param.color);
    return color;
  }

  // Actions

  private emitNewFeedback(feedback: Feedback): void {
    this.avfeedbackUpdate.emit(feedback);

    this.commentInput.nativeElement.innerHTML = '';
    this.audioMessage = null;

    const count = +localStorage.getItem('commentsCount') || 0;
    this.showWarning = count < 4;
    localStorage.setItem('commentsCount', `${count + 1}`);
  }

  sendComment(tab: string) {
    const ratingType = tab + 'Items';
    const text = this.commentInput.nativeElement.innerText;

    if (!text && !this.audioMessage) {
      return;
    }

    const feedback = new Feedback();
    feedback.text = text;
    feedback.feedbacktype = ratingType;
    feedback.avratingparam_id = this.activeAVParam.id;
    feedback.local_avratingparam = this.activeAVParam;
    feedback.avtracktimeposition = this.currentTrackposition;
    feedback.audio_message = this.audioMessage;
    feedback.face_uid =
      new Date().valueOf().toString(36) + Math.random().toString(36).substr(2);

    if (ratingType === 'linksItems') {
      this.dialog
        .open(UrlModalComponent, {
          maxWidth: '92vw',
          width: '360px',
          maxHeight: '92vh',
          autoFocus: false,
          panelClass: 'modal',
          data: { feedback, author: this.author },
        })
        .afterClosed()
        .pipe(
          takeUntil(this.destroyed),
          filter((res) => !!res),
        )
        .subscribe((res) => {
          feedback.link = res;
          this.emitNewFeedback(feedback);
        });

      return;
    }

    this.emitNewFeedback(feedback);
  }

  onActivateParam(param: AVRatingParam) {
    this.commentInput.nativeElement.innerHTML = '';
    param.active = !param.active;
    if (!param.active) {
      const next = this.selectedFile.avratingparams.find((el) => el.active);
      this.onParamSelect(next);
      if (next) {
        next.focused = true;
        this.rateflowService.avParamChange.next(next);
      }
    }
    this.rateflowService.avParamChange.next(param);
  }

  private removeFocus(): void {
    const avratingparams = this.selectedFile.avratingparams.map((param) => {
      const updated: AVRatingParam = { ...param, focused: false };
      this.rateflowService.avParamChange.next(updated);
      return updated;
    });
    this.selectedFile = { ...this.selectedFile, avratingparams };
  }

  private setAutoFocus(): void {
    if (this.commentInput?.nativeElement?.innerHTML) {
      this.commentInput.nativeElement.innerHTML = '';
    }
    let focusedOne = false;
    const avratingparams = this.selectedFile.avratingparams.map(
      (param, index) => {
        const updated: AVRatingParam = {
          ...param,
          focused: param.active && !focusedOne,
        };
        this.rateflowService.avParamChange.next(updated);

        if (focusedOne) {
          return updated;
        }
        focusedOne = updated.focused;
        return updated;
      },
    );
    this.selectedFile = { ...this.selectedFile, avratingparams };
  }

  onParamSelect(param: AVRatingParam) {
    this.activeAVParam = param;
    this.rateflowService.selectParam.emit(param?.id);
  }

  didFocusOnText() {
    let state;

    if (
      this.selectedFile.kind === 'video' ||
      this.selectedFile.kind === 'audio'
    ) {
      state = avFileStateEnum.paused;
    }

    if (this.selectedFile.kind === 'hostedvideo') {
      state = avYTStateEnum.paused;
    }

    const avFileStateChangeValue =
      this.rateflowService.avFileStateChange$.value;
    if (!avFileStateChangeValue) {
      return;
    }

    if (
      avFileStateChangeValue.state === avYTStateEnum.paused ||
      avFileStateChangeValue.state === avFileStateEnum.paused
    ) {
      return;
    }

    this.rateflowService.avFilePlaybackClickChange$.next({
      state,
      fileIDString: this.selectedFile.id,
    });
  }

  public startAudioRecording() {
    this.didFocusOnText();
    this.isRecording = true;
    this.rateflowService.audioRecordingStarted = {
      order: null,
      tab: null,
      type: 'av',
    };
  }

  public audioMessageUploaded(event: { url: string; duration: number }) {
    this.audioMessage = event;
    this.isRecording = false;
  }

  public deleteAudioMessage() {
    this.audioMessage = null;
    this.isRecording = false;
  }

  public detectPaste(event: ClipboardEvent) {
    event.preventDefault();

    const data = event.clipboardData;
    const textData = data.getData('text/plain');

    if (textData) {
      insertString(textData);
    }
  }

  public focusActive(avparam: AVRatingParam) {
    const avFileStateChangeValue =
      this.rateflowService.avFileStateChange$.value;
    if (
      avparam.active &&
      (!avFileStateChangeValue ||
        (avFileStateChangeValue?.state === avYTStateEnum.paused &&
          !avparam.focused))
    ) {
      const avratingparams = this.selectedFile.avratingparams.map((param) => {
        const updated = { ...param };
        updated.focused = avparam.id === param.id;
        if (updated.focused) {
          this.onParamSelect(param);
        }
        this.rateflowService.avParamChange.next(updated);
        return updated;
      });
      this.selectedFile = { ...this.selectedFile, avratingparams };
    }
  }
}
