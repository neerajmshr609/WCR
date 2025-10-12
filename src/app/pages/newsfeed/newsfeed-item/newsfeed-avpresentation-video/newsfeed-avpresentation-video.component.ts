import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import Hls from 'hls.js';
import { Observable, Subject } from 'rxjs';
import { filter, shareReplay, takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { avFileStateEnum, avYTStateEnum } from 'src/app/shared/enums';
import { HlsPlyrDriver } from 'src/app/shared/hls-plyr-driver';
import { Avfeedbacklane } from 'src/app/shared/models/avfeedbacklane.model';
import { AVRatingParam } from 'src/app/shared/models/avratingparam.model';
import { NewsfeedFeedback } from 'src/app/shared/models/newsfeedfeedback.model';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import { RateflowService } from 'src/app/services/rateflow.service';
import { InsightsService } from 'src/app/services/insights.service';

@Component({
  selector: 'app-newsfeed-avpresentation-video',
  templateUrl: './newsfeed-avpresentation-video.component.html',
  styleUrls: ['./newsfeed-avpresentation-video.component.scss'],
})
export class NewsfeedAvpresentationVideoComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild('lanesRef') lanesRef: ElementRef;
  @ViewChild('videoPlayedFillRef') videoPlayedFillRef: ElementRef;
  @ViewChild('singleFaceRef') singleFaceRef: ElementRef;
  @ViewChildren('multipleFaceRef') faceQueryList: QueryList<ElementRef>;

  @Input() public showCurves = true;
  @Input() avRatingParams: AVRatingParam;
  @Input() isRateflowPresentation = false;
  @Input() file: Projectfile;
  @Input() allFeedbacksFromUser: NewsfeedFeedback[];
  @Input() feedbackItem: NewsfeedFeedback;
  @Input() isActive: boolean;
  @Input() category: string;

  isPlaying = false;

  isAllFeedbackFace = false;
  lanesToPrint$ = new Subject<Avfeedbacklane[]>();

  trackTimeWidth = '0%';

  videoLoaded: boolean;

  prevYoutubeTime: number;
  youtubePlayer: any;
  youtubeProgressInterval: any;
  playerVars = {
    rel: 0,
    showinfo: 0,
    enablejsapi: 1,
    origin: location.origin,
  };

  player: Plyr;
  showPlayer: boolean;
  playerOptions = {
    controls: [
      'play-large',
      'progress',
      'mute',
      'volume',
      'settings',
      'fullscreen',
    ],
    storage: {
      enabled: false,
    },
  };
  hlsDriver: HlsPlyrDriver;
  hls = new Hls();
  videoSources: Plyr.Source[];

  playAfterLoad: boolean;

  private seeked = new EventEmitter<number>();
  public get seeked$(): Observable<number> {
    return this.seeked.pipe(shareReplay(1));
  }

  private toggleTimer = new EventEmitter<boolean>();
  public get toggleTimer$(): Observable<boolean> {
    return this.toggleTimer.pipe(shareReplay(1));
  }

  private mediaFileIsOver = new EventEmitter();
  public get mediaFileIsOver$(): Observable<void> {
    return this.mediaFileIsOver.pipe(shareReplay(1));
  }

  get duration(): number {
    if (this.file.kind === 'video') {
      return Math.trunc(this.player?.duration) || 0;
    }

    if (this.file.kind === 'hostedvideo') {
      return this.youtubePlayer?.getDuration() || 0;
    }

    return 0;
  }

  get currentTime(): number {
    if (this.file.kind === 'video') {
      return this.player?.currentTime || 0;
    }

    if (this.file.kind === 'hostedvideo') {
      return this.youtubePlayer?.getCurrentTime() || 0;
    }

    return 0;
  }

  get statusIsPlaying(): boolean {
    if (this.file.kind === 'video') {
      return this.player?.playing;
    }

    if (this.file.kind === 'hostedvideo') {
      return this.youtubePlayer?.getPlayerState() === avYTStateEnum.playing;
    }

    return false;
  }

  public get hasLanes(): boolean {
    return (
      !!this.feedbackItem?.avratingparam_id ||
      this.allFeedbacksFromUser?.some((feedback) => feedback.avratingparam_id)
    );
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private newsfeedService: NewsfeedService,
    private rateflowService: RateflowService,
    private insightsService: InsightsService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    super();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.youtubePlayer = null;
  }

  ngOnInit(): void {
    this.subscribeToVideoNotification();

    if (this.file.kind === 'video') {
      this.setVideoSource();
    }
  }

  ngAfterViewInit(): void {
    if (this.feedbackItem || this.allFeedbacksFromUser?.length) {
      this.loadLaneLevels();
    }
  }

  ngOnChanges() {
    if (!this.isActive) {
      return;
    }

    if (this.feedbackItem || this.allFeedbacksFromUser?.length) {
      this.loadLaneLevels();
    }
  }

  private subscribeToVideoNotification(): void {
    this.newsfeedService.avShouldStopExcludingSenderNotification$
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        if (this.file.kind === 'video' && this.isPlaying) {
          this.pauseVideo();
        }

        if (this.file.kind === 'hostedvideo' && this.isPlaying) {
          this.youtubePlayer?.pauseVideo();
        }
      });
  }

  public async videoClicked() {
    if (!this.videoLoaded) {
      await this.loadSource(this.videoSources[0].src);
      this.videoLoaded = true;

      setTimeout(() => {
        this.setBindings();
        this.playVideo();
      });
    }

    this.playPause();
  }

  private playPause() {
    if (this.isPlaying) {
      this.pauseVideo();
    } else {
      this.playVideo();
    }
  }

  private setBindings() {
    const onPause = () => {
      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.paused,
        fileIDString: this.file.id,
      });
      this.toggleTimer.emit(false);
    };

    const onPlay = () => {
      if (!this.hlsDriver.loaded) {
        this.hlsDriver.load(this.videoSources[0].src);
      }

      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.playing,
        fileIDString: this.file.id,
      });
      this.toggleTimer.emit(true);
    };

    const onSeeking = () => {
      this.seeked.emit(Math.round(this.player.currentTime));
      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.notloaded,
        fileIDString: this.file.id,
      });
    };

    const onSeeked = () => {
      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.paused,
        fileIDString: this.file.id,
      });
      this.toggleTimer.emit(true);
    };

    const onEnd = () => {
      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.paused,
        fileIDString: this.file.id,
      });
      this.mediaFileIsOver.emit();
    };

    this.player.on('pause', onPause);
    this.player.on('play', onPlay);
    this.player.on('ended', onEnd);
    this.player.on('seeking', onSeeking);
    this.player.on('seeked', onSeeked);
  }

  private playVideo() {
    if (!this.hlsDriver.loaded) {
      this.hlsDriver.load(this.videoSources[0].src);
    }

    this.player?.play();
    this.isPlaying = true;
  }

  private pauseVideo() {
    this.player.pause();
    this.isPlaying = false;
  }

  setVideoSource() {
    this.videoSources = [
      {
        src: this.file.playlist,
        type: 'video',
      },
    ];
  }

  stopAll() {
    this.newsfeedService.avShouldStopExcludingSenderNotification$.next({
      senderFileId: this.file.id,
    });
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

  public seekTo(time: number): void {
    if (this.file.kind === 'video' && this.player) {
      this.player.currentTime = time;
    }

    if (this.file.kind === 'hostedvideo') {
      this.youtubePlayer.seekTo(time, true);
    }
  }

  public onYTPlayerReady(event: any) {
    this.youtubePlayer = event.target;
    this.loadLaneLevels();
    this.youtubePlayer.playVideo();
  }

  onYTPlayerStateChange(event) {
    clearInterval(this.youtubeProgressInterval);

    if (event.data === avYTStateEnum.paused) {
      this.rateflowService.avFileStateChange$.next({
        state: avYTStateEnum.paused,
        fileIDString: this.file.id,
      });
      this.toggleTimer.emit(false);

      this.youtubeProgressInterval = setInterval(() => this.seekToEvent());
    }

    if (event.data === avYTStateEnum.playing) {
      this.rateflowService.avFileStateChange$.next({
        state: avYTStateEnum.playing,
        fileIDString: this.file.id,
      });
      this.toggleTimer.emit(true);
    }

    if (event.data === avYTStateEnum.buffering) {
      this.rateflowService.avFileStateChange$.next({
        state: avYTStateEnum.buffering,
        fileIDString: this.file.id,
      });
      this.seekToEvent();
    }

    if (event.data === avYTStateEnum.ended) {
      this.rateflowService.avFileStateChange$.next({
        state: avYTStateEnum.ended,
        fileIDString: this.file.id,
      });
      this.mediaFileIsOver.emit();
      this.toggleTimer.emit(false);
    }
  }

  private updateQuality(newQuality: number): void {
    this.hlsDriver.hls.levels.forEach((level, levelIndex) => {
      if (level.height === newQuality) {
        this.hlsDriver.hls.currentLevel = levelIndex;
      }
    });
  }

  private loadSource(source: string): Promise<void> {
    this.hls.loadSource(source);

    const defaultOptions: { [key: string]: any } = {};

    return new Promise((resolve, reject) =>
      this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const availableQualities = this.hls.levels.map((l) => l.height);

        const qualityIndex = availableQualities.findIndex((q) => q === 480);
        defaultOptions.quality = {
          default: availableQualities[qualityIndex !== -1 ? qualityIndex : 0],
          options: availableQualities,
          // this ensures Plyr to use Hls to update quality level
          // Ref: https://github.com/sampotts/plyr/blob/master/src/js/html5.js#L77
          forced: true,
          onChange: (e) => this.updateQuality(e),
        };

        this.playerOptions = { ...this.playerOptions, ...defaultOptions };
        this.hlsDriver = new HlsPlyrDriver(false, qualityIndex);
        this.hlsDriver.level$
          .pipe(
            takeUntil(this.destroyed),
            filter((res) => !!res),
          )
          .subscribe((res) => {
            const settingsBtns = this.document.querySelectorAll(
              '.plyr--playing [data-plyr="settings"]',
            );
            Array.from(settingsBtns)
              .filter((btn) => btn.innerHTML.includes('Quality'))[0]
              .querySelector('.plyr__menu__value').innerHTML = res + 'p';

            const qualityBtns = this.document.querySelectorAll(
              '.plyr--playing [data-plyr="quality"]',
            );
            qualityBtns.forEach((btn) => {
              const btnValue = +btn.getAttribute('value');
              btn.setAttribute('aria-checked', `${btnValue === res}`);
            });
          });
        this.showPlayer = true;
        this.cdRef.detectChanges();

        this.hls.destroy();
        resolve();
      }),
    );
  }

  private seekToEvent(): void {
    const currentTime = Math.trunc(this.youtubePlayer?.getCurrentTime());
    const diff =
      currentTime > this.prevYoutubeTime
        ? this.prevYoutubeTime - currentTime
        : currentTime - this.prevYoutubeTime;

    if (diff < 0) {
      this.seeked.emit(currentTime);
    }

    this.prevYoutubeTime = currentTime;
  }
}
