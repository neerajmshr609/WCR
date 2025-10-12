import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import WaveSurfer from '../../../../../assets/vendor/wavesurfer/wavesurfer.min';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Avfeedbacklane } from 'src/app/shared/models/avfeedbacklane.model';
import { NewsfeedFeedback } from 'src/app/shared/models/newsfeedfeedback.model';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { filter, shareReplay, takeUntil } from 'rxjs/operators';
import { AVRatingParam } from 'src/app/shared/models/avratingparam.model';
import { InsightsService } from 'src/app/services/insights.service';

@Component({
  selector: 'app-newsfeed-avpresentation',
  templateUrl: './newsfeed-avpresentation.component.html',
  styleUrls: ['./newsfeed-avpresentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsfeedAvpresentationComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnChanges, AfterContentInit
{
  @ViewChild('lanesRef') lanesRef: ElementRef;
  @ViewChild('canvasRef') canvasRef: ElementRef;
  @ViewChild('waveformRef') waveformRef: ElementRef;
  @ViewChild('singleFaceRef') singleFaceRef: ElementRef;
  @ViewChildren('multipleFaceRef') faceQueryList: QueryList<ElementRef>;

  @Input() allFeedbacksFromUser: NewsfeedFeedback[];
  @Input() file: Projectfile;
  @Input() feedbackItem: NewsfeedFeedback;
  @Input() isActive: boolean;
  @Input() category: string;
  @Input() avRatingParams: AVRatingParam;

  lanesToPrint$ = new Subject<Avfeedbacklane[]>();

  wavesurfer: WaveSurfer;
  waveIsLoading = false;
  waveLoaded$ = new BehaviorSubject<boolean>(false);

  isAllFeedbackFace = true;
  readMode: boolean;

  trackTimeWidth = '0%';

  private toggleTimer = new EventEmitter<boolean>();
  public get toggleTimer$(): Observable<boolean> {
    return this.toggleTimer.pipe(shareReplay(1));
  }

  private mediaFileIsOver = new EventEmitter();
  public get mediaFileIsOver$(): Observable<void> {
    return this.mediaFileIsOver.pipe(shareReplay(1));
  }

  get currentTime(): number {
    return Math.trunc(this.wavesurfer?.getCurrentTime()) || 0;
  }

  get duration(): number {
    return (
      Math.trunc(this.wavesurfer?.getDuration()) || this.file.duration || 0
    );
  }

  public get isPlaying(): boolean {
    return this.wavesurfer?.isPlaying() || false;
  }

  constructor(
    private newsfeedService: NewsfeedService,
    private insightsService: InsightsService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.newsfeedService.avShouldStopExcludingSenderNotification$
      .pipe(
        takeUntil(this.destroyed),
        filter((change) => !!change),
        filter(
          (change) => change.senderFileId !== this.file.id && this.isPlaying,
        ),
      )
      .subscribe(() => this.playpause());
  }

  ngAfterViewInit(): void {
    this.loadAudio();

    if (this.feedbackItem || this.allFeedbacksFromUser?.length) {
      this.loadLaneLevels();
    }
  }

  ngAfterContentInit(): void {
    this.readMode = true;
  }

  ngOnChanges() {
    if (!this.isActive) {
      return;
    }

    if (this.feedbackItem || this.allFeedbacksFromUser?.length) {
      this.loadLaneLevels();
    }
  }

  stopAll() {
    this.newsfeedService.avShouldStopExcludingSenderNotification$.next({
      senderFileId: this.file.id,
    });
  }

  playpause() {
    if (!this.waveLoaded$.value && !this.waveIsLoading) {
      this.waveIsLoading = true;
      setTimeout(() => this.loadFile());

      return;
    }

    this.wavesurfer.playPause();

    if (this.isPlaying) {
      this.stopAll();
    }
  }

  loadFile() {
    this.wavesurfer.load(this.file.url);
    this.subscribeToAudioWaveChanges();
  }

  loadAudio() {
    if (this.wavesurfer) {
      return;
    }

    this.wavesurfer = WaveSurfer.create({
      container: this.waveformRef.nativeElement,
      waveColor: '#DCDCDC',
      progressColor: '#B0B0B0',
      barWidth: 2,
      barRadius: 2,
      cursorColor: 'black',
      cursorWidth: 2,
      barGap: 1,
      barHeight: 1,
      hideScrollbar: true,
    });
  }

  seekTo(value: number): void {
    this.wavesurfer.seekTo(value / this.duration);
  }

  loadLaneLevels() {
    const ratingId =
      +this.feedbackItem?.rating_id || this.allFeedbacksFromUser[0].rating_id;

    if (this.insightsService.lanes[ratingId]) {
      this.lanesToPrint$.next(this.insightsService.lanes[ratingId]);
      return;
    }

    this.newsfeedService
      .fetchFeedbacklanesForRating(ratingId)
      .pipe(
        takeUntil(this.destroyed),
        filter((lanes) => !!lanes),
      )
      .subscribe((lanes) => this.lanesToPrint$.next(lanes));
  }

  private subscribeToAudioWaveChanges() {
    const onReady = () => {
      this.waveIsLoading = false;
      this.waveLoaded$.next(true);
      this.cdr.detectChanges();
      this.wavesurfer.playPause();

      if (this.feedbackItem || this.allFeedbacksFromUser?.length) {
        this.loadLaneLevels();
      }
    };

    const onFinish = () => {
      this.wavesurfer.stop();
      this.toggleTimer.emit(false);
      this.mediaFileIsOver.emit();
    };

    const onChange = () => {
      const width =
        (this.wavesurfer.getCurrentTime() * 100) / this.file.duration + '%';
      this.trackTimeWidth = width;
    };

    const onSeek = () => {
      const width =
        (this.wavesurfer.getCurrentTime() * 100) / this.file.duration + '%';
      this.trackTimeWidth = width;
    };

    const onPlay = () => {
      this.toggleTimer.emit(true);
    };

    const onPause = () => {
      this.toggleTimer.emit(false);
    };

    this.wavesurfer.on('ready', onReady);
    this.wavesurfer.on('audioprocess', onChange);
    this.wavesurfer.on('seek', onSeek);
    this.wavesurfer.on('finish', onFinish);
    this.wavesurfer.on('play', onPlay);
    this.wavesurfer.on('pause', onPause);
  }
}
