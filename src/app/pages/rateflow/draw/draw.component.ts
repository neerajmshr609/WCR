import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  AfterViewChecked,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { DrawDialogComponent } from './draw-dialog/draw-dialog.component';

interface Coord {
  x: number;
  y: number;
}

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
})
export class DrawComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  @ViewChild('drawRef') drawRef: ElementRef;
  @ViewChild('canvasRef') canvasRef: ElementRef<HTMLCanvasElement>;

  @Input() selectedFile: Projectfile;
  @Input() linesPoints: Array<any>;

  @Output() drawing = new EventEmitter<Array<Array<Coord>>>();

  lines: Array<Array<Coord>> = [];
  line: Array<Coord> = [];
  ratio = 1;
  isMobile: boolean = window.innerWidth < 769;

  private ctx: CanvasRenderingContext2D;
  private canvasElem: HTMLCanvasElement;
  paint: boolean;
  prev: Coord;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  calculateScaleRatio(
    blockWidth: number,
    blockHeight: number,
    fileWidth: number,
    fileHeight: number,
  ): number {
    const toFit = 120;

    const v1 = (blockWidth - toFit) / fileWidth;
    const v2 = (blockHeight - toFit) / fileHeight;
    return v1 > v2 ? v2 : v1;
  }

  ngOnInit() {
    const gotIt = localStorage.getItem('drawGotIt');
    if (!gotIt && this.isMobile) {
      const dialog = this.dialog.open(DrawDialogComponent, {
        autoFocus: false,
        width: '340px',
      });

      const subscription = dialog
        .afterClosed()
        .pipe(filter((res) => res))
        .subscribe(() => {
          localStorage.setItem('drawGotIt', 'true');
          subscription.unsubscribe();
        });
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    this.canvasElem = this.canvasRef.nativeElement;
    this.ctx = this.canvasElem.getContext('2d');

    const blockWidth = this.drawRef.nativeElement.getBoundingClientRect().width;
    const blockHeight =
      this.drawRef.nativeElement.getBoundingClientRect().height;
    const fileWidth = this.selectedFile.width;
    const fileHeight = this.selectedFile.height;

    this.ratio = this.calculateScaleRatio(
      blockWidth,
      blockHeight,
      fileWidth,
      fileHeight,
    );

    this.ctx.canvas.width = fileWidth * this.ratio;
    this.ctx.canvas.height = fileHeight * this.ratio;

    this.canvasElem.style.background = `url(${this.selectedFile.url}) no-repeat`;
    this.canvasElem.style.backgroundSize = 'contain';

    if (this.linesPoints && this.linesPoints.length) {
      this.drawPrevLines();
    }

    this.addEventListeners(this.canvasElem);
  }

  drawPrevLines() {
    for (const line of this.linesPoints) {
      for (const coord of line) {
        const x = coord.x * this.ratio;
        const y = coord.y * this.ratio;
        this.draw({ x, y });
        this.line.push({ x, y });
      }
      this.stopDrawing();
    }
  }

  addEventListeners(canvasElem) {
    canvasElem.addEventListener('mousedown', (e: any) => {
      this.paint = true;
      this.drawByMouse(e);
    });

    canvasElem.addEventListener('touchstart', (e: any) => {
      this.paint = true;
      this.drawByTouch(e);
    });

    canvasElem.addEventListener('mousemove', (e: any) => {
      if (this.paint) {
        this.drawByMouse(e);
      }
    });

    canvasElem.addEventListener('touchmove', (e: any) => {
      if (this.paint) {
        this.drawByTouch(e);
      }
    });

    canvasElem.addEventListener('mouseleave', () => this.stopDrawing());
    canvasElem.addEventListener('mouseup', () => this.stopDrawing());
    canvasElem.addEventListener('touchend', () => this.stopDrawing());
  }

  drawByMouse(event) {
    // const x = event.pageX - event.target.offsetLeft;
    // const y = event.pageY - event.target.offsetTop;

    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const y = event.clientY - rect.top; // y position within the element.

    this.draw({ x, y });
    this.line.push({ x, y });
  }

  drawByTouch(event) {
    const touches = event.touches[0];
    const x = touches.pageX - event.target.offsetLeft;
    const y = touches.pageY - event.target.offsetTop;
    this.draw({ x, y });
    this.line.push({ x, y });
  }

  draw({ x, y }: Coord) {
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

  stopDrawing() {
    this.paint = false;
    this.prev = null;
    if (this.line.length) {
      this.lines.push(this.line);
      this.line = [];
    }
  }

  undo() {
    const pop = this.lines.pop();
    if (pop.length) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      for (const line of this.lines) {
        for (const coord of line) {
          this.draw(coord);
        }
        this.prev = null;
      }
    }
  }

  delete() {
    this.lines = [];
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    const temp = [];
    this.drawing.emit(temp);
    this.lines = [];
  }

  save() {
    const temp = [];
    for (const line of this.lines) {
      temp.push(
        line.map(({ x, y }) => ({ x: x / this.ratio, y: y / this.ratio })),
      );
    }

    this.drawing.emit(temp);
    this.lines = [];
  }

  ngOnDestroy() {
    this.lines = [];
    this.line = [];
    this.linesPoints = [];
    this.selectedFile = null;
  }
}
