import { Point } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-feedback-focus-area',
  templateUrl: './feedback-focus-area.component.html',
  styleUrls: ['./feedback-focus-area.component.scss'],
})
export class FeedbackFocusAreaComponent
  extends BaseComponent
  implements AfterViewInit, OnChanges
{
  @ViewChild('triangleContainerRef') private triangleContainerRef: ElementRef;
  @ViewChild('pixelRef') private pixelRef: ElementRef;
  @ViewChild('dragRef') private dragRef: ElementRef;

  @Input() public disabled: boolean;
  @Input() private coordinates: Point;
  @Input() public fullWidth = 430;
  @Input() public markerColor = 'blue';
  @Input() public triangleColor = 'white';
  @Input() public textColor = 'gray';
  @Input() private coordinatesChange$: Observable<Point>;

  @Output() private coordinatesChange = new EventEmitter<Point>();

  public texts = [
    { text: 'feedback-focus-area.emotions', type: 'emotions' },
    { text: 'feedback-focus-area.technical_execution', type: 'tech' },
    { text: 'feedback-focus-area.idea', type: 'idea' },
  ];

  public width: number;
  public height: number;
  public cursorSize: number;
  public paddingX: number;
  public paddingY: number;

  public centerX: number;
  public centerY: number;

  public fontSize: number;
  public lineHeight: number;
  public textPT: number;
  public textPX: number;
  public textPB: number;
  public textTop: string;

  private init: boolean;
  public showCursor = true;

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.init) {
      return;
    }
    if (!changes.fullWidth?.currentValue) {
      return;
    }

    if (changes.fullWidth.currentValue !== changes.fullWidth.previousValue) {
      this.initTriangle();
    }
  }

  private initTriangle() {
    this.calculateSizes(this.fullWidth);

    if (this.coordinates) {
      this.parseCoordinates();
    }

    this.setDragPosition();
  }

  private calculateSizes(width: number) {
    this.width = width / 1.375;

    this.cursorSize = this.width / 5.3;
    this.height = (Math.sqrt(3) / 2) * this.width;
    this.paddingX = this.cursorSize / 5;
    this.paddingY = this.cursorSize / 4;

    if (!this.coordinates) {
      this.centerX = this.width / 2 + this.paddingX - this.cursorSize / 2;
      this.centerY =
        (this.height / 3) * 2 + this.paddingY - this.cursorSize / 2;
      this.saveCoordinates();
    }

    this.fontSize = this.width / 190;
    if (this.fontSize < 1) {
      this.fontSize = 1;
    }
    this.lineHeight = this.fontSize * 1.2;

    this.textPT = this.lineHeight / 1.6;
    this.textPX = this.lineHeight / 0.625;
    this.textPB = this.lineHeight / 0.417;

    this.textTop = `calc(${this.height + this.paddingY}px + ${this.textPT + 1}rem)`;
  }

  ngAfterViewInit() {
    this.initTriangle();
    this.init = true;

    this.coordinatesChange$
      ?.pipe(
        takeUntil(this.destroyed),
        tap((res: Point) => {
          this.showCursor = false;
          this.coordinates = res;
          setTimeout(() => {
            this.showCursor = true;
            this.initTriangle();
          });
        }),
      )
      .subscribe();
  }

  private setDragPosition() {
    setTimeout(() => {
      const el = this.dragRef.nativeElement as HTMLElement;
      el.style.width = this.cursorSize + 'px';
      el.style.height = this.cursorSize + 'px';
      el.style.top = this.centerY + 'px';
      el.style.left = this.centerX + 'px';
      el.style.transform = 'none';
    });
  }

  private parseCoordinates() {
    this.centerX =
      (this.coordinates.x / 100) * this.width +
      this.paddingX -
      this.cursorSize / 2;
    this.centerY =
      (this.coordinates.y / 100) * this.height +
      this.paddingY -
      this.cursorSize / 2;
  }

  public dragMoved() {
    const point = this.calculatePoint();

    if (point) {
      const rect =
        this.triangleContainerRef.nativeElement.getBoundingClientRect();
      point.x = point.x - rect.left;
      point.y = point.y - rect.top - this.cursorSize / 2;

      const x = point.x - this.centerX - this.cursorSize / 2;
      const y = point.y - this.centerY;
      this.dragRef.nativeElement.style.transform = `translate(${x}px, ${y}px)`;
    }

    this.saveCoordinates();
  }

  private saveCoordinates() {
    const dragRect = this.dragRef.nativeElement.getBoundingClientRect();
    const triangleRect =
      this.triangleContainerRef.nativeElement.getBoundingClientRect();

    const left = dragRect.left - triangleRect.left + this.cursorSize / 2;
    const top = dragRect.top - triangleRect.top + this.cursorSize / 2;

    const width = this.width + this.paddingX * 2;
    const height = this.height + this.paddingY * 2;

    const percentLeft = left / width;
    const percentTop = top / height;

    this.coordinatesChange.emit({
      x: Math.round(percentLeft * 10000) / 100,
      y: Math.round(percentTop * 10000) / 100,
    });
  }

  public calculatePoint(): Point {
    const triangle = this.triangleContainerRef.nativeElement as HTMLElement;
    const pixel = this.pixelRef.nativeElement as HTMLElement;
    const elRect = pixel.getBoundingClientRect();
    const triangleRect = triangle.getBoundingClientRect();

    const triangleTop = {
      x: this.width / 2 + this.paddingX + triangleRect.left,
      y: triangleRect.top + this.paddingY,
    };

    const triangleBottomLeft = {
      x: triangleRect.left + this.paddingX,
      y: triangleRect.top + this.height + this.paddingY,
    };

    const triangleBottomRight = {
      x: triangleRect.left + this.width + this.paddingX,
      y: triangleRect.top + this.height + this.paddingY,
    };

    const a = triangleTop;
    const b = triangleBottomLeft;
    const c = triangleBottomRight;
    const d = {
      x: elRect.left,
      y: elRect.top,
    };

    const isOnTheLeft =
      (b.x - a.x) * (d.y - a.y) - (b.y - a.y) * (d.x - a.x) > 0;
    if (isOnTheLeft) {
      return this.getClosestPoint(a, b, d);
    }

    const isOnTheRight =
      (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x) < 0;
    if (isOnTheRight) {
      return this.getClosestPoint(a, c, d);
    }
  }

  private getClosestPoint(p0, p1, q) {
    if (p0.x === p1.x && p0.y === p1.y) p0.x -= 0.00001;

    const Unumer = (q.x - p0.x) * (p1.x - p0.x) + (q.y - p0.y) * (p1.y - p0.y);
    const Udenom = Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2);
    const U = Unumer / Udenom;

    const r = {
      x: p0.x + U * (p1.x - p0.x),
      y: p0.y + U * (p1.y - p0.y),
    };

    return r;
  }
}
