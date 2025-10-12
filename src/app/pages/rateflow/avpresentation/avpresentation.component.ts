import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  EventEmitter,
  input,
} from '@angular/core';
import WaveSurfer from 'src/assets/vendor/wavesurfer/wavesurfer.min.js';
import { Observable, Subject } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { RatingLevels } from 'src/app/shared/models/audio-video-ratings';
import { RateflowService } from 'src/app/services/rateflow.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { avFileStateEnum, ProjectfileKind } from 'src/app/shared/enums';
import { AVRatingParam } from 'src/app/shared/models/avratingparam.model';
import { Feedbackobject } from 'src/app/shared/models/feedbackobject.model';
import { Projectfile } from 'src/app/shared/models/projectfile.model';

@Component({
  selector: 'app-avpresentation',
  templateUrl: './avpresentation.component.html',
  styleUrls: ['./avpresentation.component.scss'],
})
export class AvpresentationComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  @ViewChild('waveformRef') waveformRef: ElementRef;

  @Input() filesFeedback$: Observable<Feedbackobject>;
  @Input() file: Projectfile;
  @Input() avRatingParams: AVRatingParam[];

  public isAudio = input(false);

  public displayPlayBtn = input(false);

  wavesurfer: WaveSurfer;
  trackTimeWidth = '0%';

  get currentTime(): number {
    return Math.trunc(this.wavesurfer?.getCurrentTime()) || 0;
  }

  get duration(): number {
    return (
      Math.trunc(this.wavesurfer?.getDuration()) || this.file.duration || 0
    );
  }

  get statusIsPlaying(): boolean {
    return this.wavesurfer?.isPlaying();
  }

  private toggleTimer = new EventEmitter<boolean>();
  public get toggleTimer$(): Observable<boolean> {
    return this.toggleTimer.pipe(shareReplay(1));
  }

  private mediaFileIsOver = new EventEmitter();
  public get mediaFileIsOver$(): Observable<void> {
    return this.mediaFileIsOver.pipe(shareReplay(1));
  }

  private _ratingLevel$ = new Subject<RatingLevels>();
  public get ratingLevel$(): Observable<RatingLevels> {
    return this._ratingLevel$.pipe(shareReplay(1));
  }

  constructor(
    private rateflowService: RateflowService,
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.rateflowService.avFilePlaybackClickChange$
      .pipe(takeUntil(this.destroyed))
      .subscribe((didChange) => {
        if (!didChange || this.file.id !== didChange.fileIDString) {
          if (this.wavesurfer) {
            this.wavesurfer.pause();
          }
          return;
        }

        if (this.file.loadState === avFileStateEnum.loaded) {
          if (this.statusIsPlaying) {
            this.wavesurfer.pause();
            this.rateflowService.avFileStateChange$.next({
              state: avFileStateEnum.paused,
              fileIDString: this.file.id,
            });
          } else if (didChange.state !== avFileStateEnum.paused) {
            this.wavesurfer.play();
            this.rateflowService.avFileStateChange$.next({
              state: avFileStateEnum.playing,
              fileIDString: this.file.id,
            });
          }
        }
      });

    this.loadFile();
  }

  playpause() {
    this.wavesurfer.playPause();

    if (this.statusIsPlaying) {
      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.playing,
        fileIDString: this.file.id,
      });
    } else {
      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.paused,
        fileIDString: this.file.id,
      });
    }
  }

  play() {
    this.wavesurfer.play();

    if (this.statusIsPlaying) {
      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.playing,
        fileIDString: this.file.id,
      });
    } else {
      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.paused,
        fileIDString: this.file.id,
      });
    }
  }

  loadFile() {
    this.cdRef.detectChanges();
    this.loadAudio();
    this.wavesurfer.load(this.file.url);
    this.subscribeToAudioWaveChanges();
  }

  loadAudio() {
    if (this.wavesurfer) {
      return;
    }

    if (this.file.kind === ProjectfileKind.audio) {
      this.wavesurfer = WaveSurfer.create({
        container: this.waveformRef.nativeElement,
        waveColor: '#DCDCDC',
        progressColor: '#B0B0B0',
        barWidth: 2,
        barRadius: 2,
        cursorWidth: 0,
        barGap: 1,
        barHeight: 1,
      });
    }
  }

  seekTo(value: number): void {
    this.wavesurfer.seekTo(value / this.duration);
  }

  subscribeToAudioWaveChanges() {
    const onReady = () => {
      this.file.loadState = avFileStateEnum.loaded;
      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.loaded,
        fileIDString: this.file.id,
      });
      this.trackTimeWidth = '0%';
    };

    const onFinish = () => {
      this.wavesurfer.stop();
      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.loaded,
        fileIDString: this.file.id,
      });
      this.rateflowService.trackpositionUpdated$.next(0.0);
      this.trackTimeWidth = '0%';
      this.toggleTimer.emit(false);
      this.mediaFileIsOver.emit();
    };

    const onChange = () => {
      const playedTime = parseFloat(this.currentTime.toFixed(2));
      const width = ((this.currentTime * 100) / this.duration).toFixed(1) + '%';
      this.cdRef.detectChanges();

      if (width !== this.trackTimeWidth) {
        this.trackTimeWidth = width;
        this.rateflowService.trackpositionUpdated$.next(playedTime);
      }
    };

    const onSeek = () => {
      const playedTime = parseFloat(this.currentTime.toFixed(2));
      const width = ((this.currentTime * 100) / this.duration).toFixed(1) + '%';
      this.trackTimeWidth = width;
      this.cdRef.detectChanges();

      this.rateflowService.trackpositionUpdated$.next(playedTime);
    };

    const onPlay = () => {
      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.playing,
        fileIDString: this.file.id,
      });
      this.toggleTimer.emit(true);
    };

    const onPause = () => {
      this.rateflowService.avFileStateChange$.next({
        state: avFileStateEnum.paused,
        fileIDString: this.file.id,
      });
      this.toggleTimer.emit(false);
    };

    this.wavesurfer.on('ready', onReady);
    this.wavesurfer.on('play', onPlay);
    this.wavesurfer.on('pause', onPause);
    this.wavesurfer.on('audioprocess', onChange);
    this.wavesurfer.on('seek', onSeek);
    this.wavesurfer.on('finish', onFinish);
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    if (this.wavesurfer) {
      this.wavesurfer.pause();
    }
  }
}
