import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { NewsfeedFeedback } from 'src/app/shared/models/newsfeedfeedback.model';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import { PreviewIframeModalComponent } from '../iframe/preview-iframe-modal/preview-iframe-modal.component';
import { PreviewPdfModalComponent } from '../pdf/preview-pdf-modal/preview-pdf-modal.component';

interface Coord {
  x: number;
  y: number;
}

@Component({
  selector: 'app-item-media-view',
  templateUrl: './item-media-view.component.html',
  styleUrls: ['./item-media-view.component.scss'],
})
export class ItemMediaViewComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('imageContainer') drawElem: ElementRef;
  @ViewChild('canvasRef') canvasRef: ElementRef;

  @Input() feedbackItem: NewsfeedFeedback;

  @Input() showDrawing$: Observable<boolean>;
  @Input() selectedFileImageView$: BehaviorSubject<Projectfile>;

  @Input() file: Projectfile;
  @Input() fileFeedbacks: NewsfeedFeedback[];

  @Input() public showCurves = true;
  @Input() public isActive = true;
  @Input() public variousHeight: boolean;
  @Input() public isFileInfoOpen: boolean;
  @Input() public category: string;

  @Output() private init = new EventEmitter<void>();
  @Output() public toggleFileInfo = new EventEmitter<void>();

  private ctx: CanvasRenderingContext2D;
  private prev: any;
  private ratio = 1;

  constructor(
    private cdRef: ChangeDetectorRef,
    private newsfeedService: NewsfeedService,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
    if (this.file?.likecount) {
      return;
    }

    if (this.feedbackItem?.projectfile) {
      this.file = this.feedbackItem.projectfile;
      return;
    }

    this.selectedFileImageView$
      ?.pipe(
        takeUntil(this.destroyed),
        tap((value) => {
          this.file = value || null;
          this.cdRef.detectChanges();
        }),
      )
      .subscribe();

    this.showDrawing$
      ?.pipe(
        takeUntil(this.destroyed),
        filter(() => !!this.feedbackItem && !!this.ctx),
        tap((res) =>
          res
            ? this.drawPrevLines(JSON.parse(this.feedbackItem.drawing))
            : this.clearCanvas(),
        ),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    if (this.feedbackItem && !this.file) {
      this.fetchMedia();
    }

    if (this.feedbackItem?.drawing) {
      this.init.emit();
    }
  }

  private fetchMedia() {
    this.newsfeedService
      .fetchMediaForFeedbackID(this.feedbackItem.id)
      .pipe(tap((res) => (this.file = res[0])))
      .subscribe();
  }

  private clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
  }

  private initCanvas(lines: string) {
    let elem;
    if (!this.canvasRef) {
      return;
    }

    elem = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.ctx = elem.getContext('2d');

    const blockWidth =
      this.drawElem.nativeElement.getBoundingClientRect().width;
    const blockHeight =
      this.drawElem.nativeElement.getBoundingClientRect().height;
    const fileWidth = this.file.width;
    const fileHeight = this.file.height;

    this.ratio = this.calculateScaleRatio(
      blockWidth,
      blockHeight,
      fileWidth,
      fileHeight,
    );

    this.ctx.canvas.width = fileWidth * this.ratio;
    this.ctx.canvas.height = fileHeight * this.ratio;

    this.drawPrevLines(JSON.parse(lines));
  }

  private calculateScaleRatio(
    blockWidth: number,
    blockHeight: number,
    fileWidth: number,
    fileHeight: number,
  ): number {
    const v1 = blockWidth / fileWidth;
    const v2 = blockHeight / fileHeight;
    return v1 > v2 ? v2 : v1;
  }

  private draw({ x, y }: Coord) {
    this.ctx.strokeStyle = '#ffff00';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = 2;
    const coord = { x, y };

    if (this.prev) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.prev.x, this.prev.y);
      this.ctx.lineTo(coord.x, coord.y);
      this.ctx.stroke();
    }

    this.prev = coord;
  }

  private drawPrevLines(linesPoints: Array<Array<Coord>>) {
    for (const line of linesPoints) {
      for (const coord of line) {
        const x = coord.x * this.ratio;
        const y = coord.y * this.ratio;
        this.draw({ x, y });
      }

      this.prev = null;
    }
  }

  public loadIframe() {
    this.dialog.open(PreviewIframeModalComponent, {
      width: 'calc(100vw - 2.4rem)',
      height: 'calc(100vh - 2.4rem)',
      maxWidth: 'unset',
      maxHeight: 'unset',
      autoFocus: false,
      data: this.file.url,
    });
  }

  public loadPdf() {
    this.dialog.open(PreviewPdfModalComponent, {
      width: 'calc(100vw - 20rem)',
      height: 'calc(100vh - 20rem)',
      maxWidth: 'unset',
      maxHeight: 'unset',
      autoFocus: false,
      data: this.file.url,
    });
  }

  public onDomChange() {
    this.initCanvas(this.feedbackItem.drawing);
  }
}
