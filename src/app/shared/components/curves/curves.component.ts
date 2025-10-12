import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  input,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { Avtrackface } from '../../models/avtrackface.model';
import { Projectfile } from '../../models/projectfile.model';
import { BaseComponent } from '../base.component';
import * as SvgJs from '@svgdotjs/svg.js';
import { AVRatingParam } from '../../models/avratingparam.model';
import { Feedbackobject } from '../../models/feedbackobject.model';
import { Curve, RatingRecord } from '../../models/curve';
import { NewsfeedFeedback } from '../../models/newsfeedfeedback.model';
import { Feedback } from '../../models/feedback.model';
import { RateflowService } from 'src/app/services/rateflow.service';
import { PrintAvfeedbackLane } from '../../models/avfeedbacklane.model';
import { Avtimelevel } from '../../models/avtimelevel.model';

const FACE_RADIUS = 14;

@Component({
  selector: 'app-curves',
  templateUrl: './curves.component.html',
  styleUrls: ['./curves.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurvesComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('cursor') cursorRef: ElementRef;
  @ViewChild('fill') fillRef: ElementRef;
  @ViewChild('lanes') lanesRef: ElementRef;
  @ViewChild('curvesContainer') curvesContainerRef: ElementRef;

  @Input() private playerExists: boolean;
  @Input() file: Projectfile;
  @Input() trackFaces: Avtrackface[] = [];
  @Input() avRatingParams: AVRatingParam[];
  @Input() toggleTimer$ = new Observable<boolean>();
  @Input() seeked$ = new Observable<number>();
  @Input() mediaFileIsOver$ = new Observable<void>();
  @Input() filesFeedback$ = new Observable<Feedbackobject>();
  @Input() duration: number;
  @Input() readMode = false;
  @Input() lanesToPrint$:
    | Observable<PrintAvfeedbackLane[]>
    | BehaviorSubject<PrintAvfeedbackLane[]>;
  @Input() feedbackItems: NewsfeedFeedback[];
  @Input() background: string;

  @Output() seekTo = new EventEmitter<number>();

  private timerSub = new Subscription();

  private _currentTick$ = new BehaviorSubject<number>(null);
  private get currentTick(): number {
    return this._currentTick$.value;
  }
  private set currentTick(value: number) {
    this._currentTick$.next(value);
  }

  private get curves(): Curve[] {
    if (!this.rateflowService.curves) {
      return null;
    }

    return this.rateflowService.curves[this.file.id] || null;
  }

  private set curves(value: Curve[]) {
    if (!this.rateflowService.curves) {
      this.rateflowService.curves = {
        [this.file.id]: [],
      };
    }

    this.rateflowService.curves[this.file.id] = value;
  }

  public isAudio: boolean;
  private timerStarted: boolean;
  private svgCanvas: SvgJs.Container;
  private mediaFileIsOver = false;
  private seeked = false;
  private userAction = false;
  private isDraftMode = false;
  private draftInitialized = false;

  private get lanesElem(): HTMLElement {
    return this.lanesRef.nativeElement;
  }

  constructor(
    private renderer: Renderer2,
    private rateflowService: RateflowService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  /**
   * When the user starts recording rating or changes rating when recording or jumps to another position while recording the rating
   *
   * https://docs.google.com/document/d/1FEkrC_l4Qk2ff-14KFaYPzHSbDT55wZk-Co66nDBiso/edit#heading=h.j68hbvpqzb5z
   */
  private addChangedRatingRecord(curve: Curve, tick: number): void {
    const curveRatingRecords = curve.ratingRecords;
    const startRecordIndex = curveRatingRecords.findIndex(
      (r) => r.tick === tick && r.type === 'start',
    );
    const startRecord = curveRatingRecords[startRecordIndex];
    const nextTickRecord = curveRatingRecords.find((r) => r.tick === tick + 1);

    if (startRecord) {
      if (nextTickRecord) {
        curveRatingRecords.splice(startRecordIndex, 1);
      } else {
        curveRatingRecords[startRecordIndex].tick++;
      }
    }

    if (!startRecord && !nextTickRecord) {
      const prevRecordIndex = curveRatingRecords
        .map((r) => r.tick < tick)
        .lastIndexOf(true);
      const prevRecord = curveRatingRecords[prevRecordIndex];

      if (prevRecord?.type === 'start') {
        curveRatingRecords.push({
          type: 'start',
          tick: tick + 1,
          level: prevRecord.level,
        });
      } else {
        curveRatingRecords.push({ type: 'end', tick: tick + 1 });
      }
    }

    curveRatingRecords.push({ type: 'start', tick, level: curve.lastLevel });
    curveRatingRecords.sort((a, b) => a.tick - b.tick);
    curve.algorithmTick = tick;
  }

  /**
   * When the user continues recording rating without changing the rate and position
   *
   * https://docs.google.com/document/d/1FEkrC_l4Qk2ff-14KFaYPzHSbDT55wZk-Co66nDBiso/edit#heading=h.7esag6nonys2
   */
  private addRatingRecord(curve: Curve, tick: number): void {
    // do not execute the algorithm if antoher algorithm was executed in the current tick
    if (curve.algorithmTick === tick) {
      return;
    }

    const curveRatingRecords = curve.ratingRecords;
    const currentRecordIndex = curveRatingRecords
      .map((r) => r.tick === tick)
      .lastIndexOf(true);
    const nextRecord = curveRatingRecords[currentRecordIndex + 1];

    if (currentRecordIndex === -1) {
      return;
    }

    if (nextRecord?.tick === tick + 1) {
      curveRatingRecords.splice(currentRecordIndex, 1);
    } else {
      curveRatingRecords[currentRecordIndex].tick++;
    }

    curve.algorithmTick = tick;
  }

  private translateRecordsIntoSvg(curve: Curve): void {
    const { width, height } = this.getLanesContainerSize();

    const calculateYPos = (level: number): number => {
      return (level * height) / 100;
    };

    if (!curve.svgPath) {
      curve.svgPath = this.svgCanvas.path();
    }

    let state = 'skipping';
    let prevLevel = null;

    const svgCommands = [];
    for (const record of curve.ratingRecords) {
      const xPos = Math.ceil((record.tick * width) / this.duration);

      if (record.type === 'start') {
        if (state === 'drawing') {
          svgCommands.push(['L', xPos, calculateYPos(-prevLevel)]);
        } else {
          svgCommands.push(['M', xPos, calculateYPos(-record.level)]);
          state = 'drawing';
        }

        svgCommands.push(['L', xPos, calculateYPos(-record.level)]);
        prevLevel = record.level;
      } else {
        const xPosEnd = Math.ceil(((record.tick - 1) * width) / this.duration);
        svgCommands.push(['L', xPosEnd, calculateYPos(-prevLevel)]);
        state = 'skipping';
      }
    }

    if (!svgCommands.length) {
      return;
    }

    curve.svgPath.plot(svgCommands);
    curve.svgPath
      .attr('id', this.file.id + '-' + curve.avParamId)
      .fill('none')
      .stroke({
        color: curve.color,
        width: 4,
        linecap: 'round',
        linejoin: 'round',
      });
  }

  private updateCurvesByAction(tick: number): void {
    this.userAction = true;
    this.seeked = true;

    this.toggleTimer(false);
    this.currentTick = tick;
    this.updateCursor(this.currentTick);
  }

  public onTimelineClick(event): void {
    if (!this.playerExists) {
      return;
    }

    const width =
      this.curvesContainerRef.nativeElement.getBoundingClientRect().width;
    const clickedTick = Math.ceil((this.duration * event.offsetX) / width);

    if (clickedTick >= this.duration) {
      return;
    }

    this.updateCurvesByAction(clickedTick);
    this.seekTo.emit(this.currentTick);
  }

  private updateCursor(currentTick: number) {
    const width = (currentTick * 100) / this.duration + '%';
    this.renderer.setStyle(this.cursorRef.nativeElement, 'left', width);

    if (!this.readMode && !this.mediaFileIsOver) {
      this.renderer.setStyle(this.canvasRef.nativeElement, 'width', width);
    }

    if (!this.isAudio) {
      this.renderer.setStyle(this.fillRef.nativeElement, 'width', width);
    }
  }

  private toggleTimer(isStart: boolean): void {
    if (this.timerStarted === isStart) {
      return;
    }

    this.timerStarted = isStart;

    if (isStart) {
      const currentTick = this.currentTick || 0;

      if (this.isDraftMode) {
        this.initInDraftMode();
      }

      this.timerSub = timer(0, 1000)
        .pipe(takeUntil(this.destroyed))
        .subscribe((res) => this._currentTick$.next(currentTick + res));

      return;
    }

    this.timerSub.unsubscribe();
  }

  private initInDraftMode(): void {
    if (this.draftInitialized) {
      return;
    }
    const canvasElem: HTMLElement = this.canvasRef.nativeElement;
    const svgPathElems = canvasElem.querySelectorAll('path');
    svgPathElems.forEach((e) => e.remove());

    this.curves.forEach((c) => this.translateRecordsIntoSvg(c));
    this.draftInitialized = true;
  }

  private startRecordingRatings(): void {
    this._currentTick$
      .pipe(
        tap((res) => {
          this.seeked = false;
          this.rateflowService.trackpositionUpdated$.next(res);
        }),
        filter((res) => res != null && this.timerStarted),
        takeUntil(this.destroyed),
      )
      .subscribe((res) => {
        this.updateCursor(res);

        if (!this.readMode) {
          this.curves
            .filter((c) => c.active)
            .forEach((curve) => {
              if (
                !curve.ratingRecords.length ||
                (this.mediaFileIsOver && !res) ||
                this.userAction
              ) {
                this.addChangedRatingRecord(curve, res);
              } else {
                this.addRatingRecord(curve, res);
              }

              this.translateRecordsIntoSvg(curve);
            });

          this.userAction = false;
        }
      });
  }

  private initCurvesForCreating(): void {
    if (this.curves) {
      return;
    }

    this.curves = (
      this.file.avratingparams ? this.file.avratingparams : []
    ).map((p) => ({
      avParamId: p.id,
      fileId: +this.file.id,
      color: this.rateflowService.colorFromString(p.color),
      ratingRecords: [],
      active: p.active,
      svgPath: null,
      lastLevel: 0,
      algorithmTick: null,
    }));

    this.curves.sort((a, b) => b.avParamId - a.avParamId);
  }

  private getLanesContainerSize(): { width: number; height: number } {
    const lanesBoudingRect = this.lanesElem.getBoundingClientRect();
    const width = lanesBoudingRect.width;
    const height = lanesBoudingRect.height - 4; // 4 is line height

    return { width, height };
  }

  private createRatingFace(
    width: number,
    yPos: number,
    feedback: Feedback,
    curve: Partial<Curve>,
  ): Avtrackface {
    const face = new Avtrackface();

    const x =
      (width * feedback.avtracktimeposition) / this.duration - FACE_RADIUS;
    const y = yPos;
    face.x = x < 0 ? 0 : x;
    face.y = y < 0 ? 0 : y;

    face.avratingparam_id = feedback.avratingparam_id;
    face.color = curve.color;
    face.comment = feedback.text;
    face.imagePath =
      'assets/feedbackcards-invert/' + feedback.feedbacktype + '.svg';
    face.trackposition = feedback.avtracktimeposition;
    face.uid = feedback.face_uid;

    return face;
  }

  private setFacesOnTimeline(feedback: Feedback) {
    const { width, height } = this.getLanesContainerSize();
    const curve = this.curves.find(
      (c) => c.avParamId === feedback.avratingparam_id,
    );

    const yPos = height / 2 - (curve.lastLevel * height) / 100 - FACE_RADIUS;
    const face = this.createRatingFace(width, yPos, feedback, curve);
    this.trackFaces.push(face);
  }

  private findClosestRecord(
    timeLevels,
    feedbackItem: NewsfeedFeedback,
  ): RatingRecord {
    const feedbackTime = feedbackItem.avtracktimeposition;
    const levels = timeLevels.filter((l) => l.level != null);

    if (!levels?.length) {
      return null;
    }

    return levels.reduce((prev, curr) =>
      Math.abs(curr.timeposition - feedbackTime) <
      Math.abs(prev.timeposition - feedbackTime)
        ? curr
        : prev,
    );
  }

  private initCurvesForReading(): void {
    this.lanesToPrint$.pipe(takeUntil(this.destroyed)).subscribe((res) => {
      const { width, height } = this.getLanesContainerSize();

      if (!this.feedbackItems?.length && !this.isDraftMode) {
        return;
      }

      this.trackFaces = [];
      this.svgCanvas.clear();

      const drawCurve = (
        avParamId: number,
        color: string,
        levels: Avtimelevel[],
      ) => {
        const curve: Curve = {
          avParamId,
          fileId: +this.file.id,
          color: this.rateflowService.colorFromString(color),
          ratingRecords: levels.map((timeLevel) => ({
            type: timeLevel.command,
            tick: timeLevel.timeposition,
            level: timeLevel.level,
          })),
          active: null,
          svgPath: null,
          lastLevel: levels[levels.length - 1].level,
          algorithmTick: null,
        };
        this.translateRecordsIntoSvg(curve);
        this.renderer.setStyle(this.canvasRef.nativeElement, 'width', '100%');
        return curve;
      };

      const drawFace = (
        timeLevels: Avtimelevel[],
        feedbackItem: NewsfeedFeedback,
        curve: Curve,
      ) => {
        const closestRatingRecord: RatingRecord = this.findClosestRecord(
          timeLevels,
          feedbackItem,
        );
        const yPos =
          height / 2 -
          ((closestRatingRecord?.level || 0) * height) / 100 -
          FACE_RADIUS;
        const face = this.createRatingFace(width, yPos, feedbackItem, curve);
        this.trackFaces.push(face);
      };
      const allLanes = Array.from(
        new Set(res.map((item) => item.avratingparam.id)),
      );

      const avratingparamIds = this.feedbackItems.map(
        (item) => item.avratingparam_id,
      );
      const lanesWithFeedbacks = allLanes.filter((id) =>
        avratingparamIds.includes(id),
      );
      const lanesWithoutFeedbacks = allLanes.filter(
        (id) => !avratingparamIds.includes(id),
      );

      lanesWithoutFeedbacks.forEach((id) => {
        res
          .filter((lane) => lane.avratingparam.id === id)
          .forEach((lane) => {
            const timeLevels = lane.avtimelevels;
            drawCurve(lane.avratingparam.id, lane.color, timeLevels);
          });
      });
      lanesWithFeedbacks.forEach((id) => {
        const lanes = res.filter((l) => l.avratingparam.id === id);
        const lane = lanes[0];
        lane.avtimelevels = lane.avtimelevels.concat(
          ...lanes
            .slice(1)
            .map((l) => l.avtimelevels)
            .flat(),
        );
        const timeLevels = lane.avtimelevels;
        const curve = drawCurve(lane.avratingparam.id, lane.color, timeLevels);
        this.feedbackItems
          .filter((feedback) => feedback.avratingparam_id === id)
          .forEach((feedback) => {
            drawFace(timeLevels, feedback, curve);
          });
      });
      this.cdr.detectChanges();
    });
  }

  private onParamSelect(): void {
    this.rateflowService.selectParam
      .pipe(
        takeUntil(this.destroyed),
        filter(
          (res) =>
            this.curves.findIndex((c) => c.avParamId === res) !==
            this.curves.length - 1,
        ),
      )
      .subscribe((res) => {
        if (this.trackFaces.map((f) => f.avratingparam_id).includes(res)) {
          const faces: Avtrackface[] = [];

          for (let i = 0; i < this.trackFaces.length; i++) {
            if (this.trackFaces[i].avratingparam_id === res) {
              faces.push(...this.trackFaces.splice(i, 1));
            }
          }
          this.trackFaces.push(...faces);
        }

        const canvasElem: HTMLElement = this.canvasRef.nativeElement;
        const svgPathElems = canvasElem.querySelectorAll('path');
        svgPathElems.forEach((e) => e.remove());

        const index = this.curves.findIndex((c) => c.avParamId === res);
        const curve = this.curves.splice(index, 1)[0];
        this.curves.push(curve);

        this.curves.forEach((c) => {
          c.svgPath = null;
          this.translateRecordsIntoSvg(c);
        });
      });
  }

  private onParamChange(): void {
    this.rateflowService.avParamChange
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => res && res.projectfile_id === +this.file.id),
      )
      .subscribe((res) => {
        const changedCurve = this.curves.find((c) => c.avParamId === res.id);
        changedCurve.active = res.active;

        if (changedCurve.active) {
          this.addChangedRatingRecord(changedCurve, this.currentTick);
        }
      });
  }

  private onRatingChange(): void {
    this.rateflowService.avSliderDidSlide$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => res.fileID === this.file.id),
        map((res) => ({
          fileId: res.fileID,
          avParam: res.param,
          level: res.value,
        })),
      )
      .subscribe((res) => {
        const changedCurve = this.curves.find(
          (c) => res.avParam.id === c.avParamId,
        );
        changedCurve.lastLevel = res.level;

        if (changedCurve.active) {
          this.addChangedRatingRecord(changedCurve, this.currentTick || 0);
        }
      });
  }

  private onFeedbackCreate(): void {
    this.filesFeedback$
      ?.pipe(
        filter((res) => res.fileId === this.file.id),
        filter((res) => !!res?.feedbacks),
        map((res: Feedbackobject) => res.feedbacks[res.feedbacks.length - 1]),
        filter((res) => !!res.avratingparam_id),
        takeUntil(this.destroyed),
      )
      .subscribe((res) => this.setFacesOnTimeline(res));
  }

  private onPlayingModeChnage(): void {
    this.rateflowService.playingModeChange
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        this.curves.forEach((c) => (c.active = res));

        if (res && this.currentTick) {
          this.curves.forEach((c) =>
            this.addChangedRatingRecord(c, this.currentTick),
          );
        }
      });
  }

  private onFeedbackDelete(): void {
    this.rateflowService.feedbackObjectDelete
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        filter(
          (res) =>
            res.local_avratingparam.projectfile_id === +this.file.id &&
            !!res.face_uid,
        ),
      )
      .subscribe((res) => {
        const index = this.trackFaces.findIndex((f) => f.uid === res.face_uid);
        this.trackFaces.splice(index, 1);
      });
  }

  private onDraftParsed() {
    this.rateflowService.draftParsed$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => res),
        tap(() => {
          const lanes = this.rateflowService.state.currentAVLanes
            .filter((lane) => {
              return (
                lane.avtimelevels.length &&
                lane.projectfile_id === +this.file.id
              );
            })
            .map((lane) => ({
              ...lane,
              avratingparam: { id: lane.avratingparam_id },
            }));
          this.lanesToPrint$ = new BehaviorSubject(lanes) as BehaviorSubject<
            PrintAvfeedbackLane[]
          >;

          this.feedbackItems = this.rateflowService.state.currentFilesFeedbacks
            .filter((feedback) => {
              return feedback.fileId === this.file.id;
            })
            .map((feedback) => feedback.feedbacks || [])
            .flat()
            .filter((feedback) => {
              return feedback.avratingparam_id;
            })
            .map((feedback) => {
              return {
                ...feedback,
                avratingparam: {
                  id: feedback.avratingparam_id,
                  ...feedback.local_avratingparam,
                },
              };
            });

          setTimeout(() => {
            this.isDraftMode = true;
            this.updateCurvesByAction(0);
            this.initCurvesForReading();
          });
        }),
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.isAudio = this.file.mimetype.includes('audio', 0);

    if (this.readMode) {
      this.initCurvesForReading();
    } else {
      this.initCurvesForCreating();
    }

    this.onParamSelect();
    this.onParamChange();
    this.onPlayingModeChnage();
    this.onRatingChange();
    this.onFeedbackDelete();
    this.onFeedbackCreate();

    this.toggleTimer$
      .pipe(
        filter((res) => this.timerStarted !== res),
        takeUntil(this.destroyed),
      )
      .subscribe((res) => this.toggleTimer(res));

    this.mediaFileIsOver$.pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.mediaFileIsOver = true;
      this.currentTick = 0;
      this.updateCursor(0);
    });

    this.seeked$
      .pipe(
        filter(() => !this.seeked),
        takeUntil(this.destroyed),
      )
      .subscribe((res) => this.updateCurvesByAction(res));

    this.startRecordingRatings();
  }

  ngAfterViewInit(): void {
    this.svgCanvas = SvgJs.SVG()
      .addTo(this.canvasRef.nativeElement)
      .size(this.getLanesContainerSize().width);
    this.onDraftParsed();
  }
}
