import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  EventEmitter,
  Inject,
  AfterViewInit,
  HostListener,
  output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { filter, shareReplay, takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import Hls from 'hls.js';
import { DOCUMENT } from '@angular/common';
import { Curve } from 'src/app/shared/models/curve';
import { RateflowService } from 'src/app/services/rateflow.service';
import { avFileStateEnum, avYTStateEnum } from 'src/app/shared/enums';
import { HlsPlyrDriver } from 'src/app/shared/hls-plyr-driver';
import { AVRatingParam } from 'src/app/shared/models/avratingparam.model';
import { Feedbackobject } from 'src/app/shared/models/feedbackobject.model';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-avpresentation-video',
  templateUrl: './avpresentation-video.component.html',
  styleUrls: ['./avpresentation-video.component.scss'],
})
export class AvpresentationVideoComponent
  extends BaseComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('canvasRef') canvasRef: ElementRef;
  @ViewChild('lanesRef') lanesRef: ElementRef;
  @ViewChild('videoRef') videoRef: ElementRef<HTMLElement>;
  @ViewChild('ytPlayer') youtubePlayer!: YouTubePlayer;

  @Input() avRatingParams: AVRatingParam[];
  @Input() filesFeedback$: Observable<Feedbackobject>;
  @Input() isRateflowPresentation = false;
  @Input() isNewsfeedPresentation = false;
  @Input() file: Projectfile;
  public videoHeight = output<string>();
  player: Plyr;
  isMobile: boolean = window.innerWidth < 769;

  videoSources: Plyr.Source[];
  hlsDriver: HlsPlyrDriver;
  hls = new Hls();
  showPlayer: boolean;

  playerOptions = {
    controls: [
      'play-large',
      'current-time',
      'progress',
      'duration',
      'mute',
      'volume',
      'settings',
      'fullscreen',
    ],
    storage: {
      enabled: false,
    },
  };

  prevYoutubeTime: number;
  youtubeProgressInterval: any;
  playerVars = {
    rel: 0,
    showinfo: 0,
    enablejsapi: 1,
    origin: location.origin,
  };

  curves: Curve[] = [];
  public showVideo: boolean;

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
      return Math.trunc(this.youtubePlayer?.getDuration()) || 0;
    }

    return 0;
  }

  constructor(
    private rateflowService: RateflowService,
    private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
  ) {
    super();
  }

  private resizeVideo() {
    this.showVideo = false;
    const block = this.videoRef.nativeElement;

    block.style.height = `100%`;
    block.style.width = `100%`;

    setTimeout(() => {
      const width = block.clientWidth;
      const height = block.clientHeight;
      const fit = width / 1.78 < height ? 'width' : 'height';
      const requiredHeight = `${width / 1.78 + 99}px`;
      block.style.height = requiredHeight;
      block.style.minHeight = requiredHeight;
      this.videoHeight.emit(requiredHeight);

      this.showVideo = true;
    });
  }

  ngAfterViewInit(): void {
    this.rateflowService.avFileStateChange$
      .pipe(
        takeUntil(this.destroyed),
        filter(
          (res) =>
            res?.state === avFileStateEnum.playing &&
            this.file.id !== res.fileIDString,
        ),
      )
      .subscribe(() => {
        if (this.file.kind === 'video') {
          this.player?.pause();
        }

        if (this.file.kind === 'hostedvideo' && this.youtubePlayer) {
          this.youtubePlayer?.pauseVideo();
        }
      });

    this.rateflowService.avFilePlaybackClickChange$
      .pipe(takeUntil(this.destroyed))
      .subscribe((changeEvent) => {
        if (!changeEvent || changeEvent.fileIDString !== this.file.id) {
          if (this.player) {
            this.player.pause();
          }
          return;
        }

        if (this.file.kind === 'video') {
          if (!this.player) {
            return;
          }

          if (this.file.loadState === avFileStateEnum.loaded) {
            if (this.player.playing) {
              this.player.pause();
              this.rateflowService.avFileStateChange$.next({
                state: avFileStateEnum.paused,
                fileIDString: this.file.id,
              });
            } else if (changeEvent.state !== avFileStateEnum.paused) {
              this.playVideo();
            }
          }
        }

        if (this.file.kind === 'hostedvideo') {
          if (!this.youtubePlayer) {
            return;
          }

          // @ts-ignore
          if (this.youtubePlayer.getPlayerState() === avYTStateEnum.playing) {
            this.youtubePlayer.pauseVideo();
            this.rateflowService.avFileStateChange$.next({
              state: avYTStateEnum.paused,
              fileIDString: this.file.id,
            });
          } else {
            this.rateflowService.avFileStateChange$.next({
              state: avYTStateEnum.playing,
              fileIDString: this.file.id,
            });
            // @ts-ignore
            if (!this.youtubePlayer._player) {
              // @ts-ignore
              this.youtubePlayer._load(true);
            }
            this.youtubePlayer.playVideo();
          }
        }
      });

    if (this.file.kind === 'video') {
      this.preloadVideo();
    }
    this.resizeVideo();
  }

  playVideo() {
    this.hlsDriver.load(this.videoSources[0].src);
    this.player.play();
    this.rateflowService.avFileStateChange$.next({
      state: avFileStateEnum.playing,
      fileIDString: this.file.id,
    });
  }

  private loadSource(source: string): Promise<void> {
    this.hls.loadSource(source);

    const defaultOptions: { [key: string]: any } = {};

    return new Promise((resolve, reject) =>
      this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const qualityLevels = [
          { label: '1080p', height: 1080, url: this.file.quality?.full_hd },
          { label: '720p', height: 720, url: this.file.quality?.hd },
          { label: '480p', height: 480, url: this.file.quality?.sq },
        ].filter((q) => !!q.url); // Remove null URLs

        const availableQualities = qualityLevels.map((q) => q.height);
        const defaultQuality = 720;

        defaultOptions.quality = {
          default: defaultQuality,
          options: availableQualities,
          // this ensures Plyr to use Hls to update quality level
          // Ref: https://github.com/sampotts/plyr/blob/master/src/js/html5.js#L77
          forced: true,
          onChange: (newQuality: number) => {
            const selected = qualityLevels.find((q) => q.height === newQuality);
            if (selected) {
              const videoElement =
                this.videoRef.nativeElement.querySelector('video');
              this.videoSources = [
                {
                  src: selected?.url,
                  type: 'video',
                },
              ];
              // Clean and reset HLS
              this.hls.detachMedia();
              this.hls.destroy();
              this.hls = new Hls();
              this.hls.attachMedia(videoElement);

              // Load new quality source
              this.hls.loadSource(selected.url);

              this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // Reset player to beginning and play
                this.player.currentTime = 0;
              });
            }
          },
        };

        this.playerOptions = { ...this.playerOptions, ...defaultOptions };
        this.hlsDriver = new HlsPlyrDriver(false, defaultQuality);
        this.hlsDriver.level$
          .pipe(
            takeUntil(this.destroyed),
            filter((res) => !!res),
          )
          .subscribe((res) => {
            const settingsBtns = this.document.querySelectorAll(
              '[data-plyr="settings"]',
            );
            Array.from(settingsBtns)
              .filter((btn) => btn.innerHTML.includes('Quality'))[0]
              .querySelector('.plyr__menu__value').innerHTML = res + 'p';

            const qualityBtns = this.document.querySelectorAll(
              '[data-plyr="quality"]',
            );
            qualityBtns.forEach((btn) => {
              const btnValue = +btn.getAttribute('value');
              btn.setAttribute('aria-checked', `${btnValue === res}`);
            });
          });
        this.showPlayer = true;
        this.cdRef.detectChanges();
        resolve();
      }),
    );
  }

  async preloadVideo() {
    this.rateflowService.avFileStateChange$.next({
      state: avFileStateEnum.notloaded,
      fileIDString: this.file.id,
    });
    this.cdRef.detectChanges();

    this.videoSources = [
      {
        src: this.file?.quality?.hd,
        type: 'video',
      },
    ];

    await this.loadSource(this.videoSources[0].src).then(() => {
      const onReady = () => {
        this.file.loadState = avFileStateEnum.loaded;
        this.rateflowService.avFileStateChange$.next({
          state: avFileStateEnum.loaded,
          fileIDString: this.file.id,
        });
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

        if (this.player.playing) {
          this.toggleTimer.emit(true);
        }
      };

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
      };

      const onPlaying = () => {
        this.rateflowService.avFileStateChange$.next({
          state: avFileStateEnum.playing,
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

      this.player.on('play', onPlay);
      this.player.on('playing', onPlaying);
      this.player.on('ended', onEnd);
      this.player.on('pause', onPause);
      this.player.on('ready', onReady);
      this.player.on('seeking', onSeeking);
      this.player.on('seeked', onSeeked);
    });
  }

  seekTo(time: number): void {
    if (this.file.kind === 'video') {
      this.player.currentTime = time;
    }

    if (this.file.kind === 'hostedvideo') {
      this.youtubePlayer.seekTo(time, true);
    }
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

  @HostListener('window:resize') onResize() {
    this.resizeVideo();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.player?.playing) {
      this.player.pause();
    }

    this.youtubePlayer = null;

    if (this.file.kind === 'hostedvideo') {
      this.rateflowService.avFileStateChange$.next({
        state: avYTStateEnum.unstarted,
        fileIDString: null,
      });
    }

    if (this.file.kind === 'video') {
      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.notloaded,
        fileIDString: null,
      });
    }
  }
}
