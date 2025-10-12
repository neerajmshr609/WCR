import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
@Component({
  selector: 'app-second-card',
  templateUrl: './second-card.component.html',
  styleUrls: ['./second-card.component.scss'],
})
export class SecondCardComponent implements OnInit, AfterViewInit {
  @ViewChild('videoRef') videoRef: ElementRef;

  @Output() clickClose = new EventEmitter();

  playerVars = {
    rel: 0,
    showinfo: 0,
    enablejsapi: 1,
    origin: location.origin,
  };

  height: number;

  @HostListener('window:resize') onResize() {
    this.setVideoHeight();
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setVideoHeight();
  }

  private setVideoHeight(): void {
    const width = this.videoRef.nativeElement.getBoundingClientRect().width;
    this.height = (width * 9) / 16 - 3;
    this.cdr.detectChanges();
  }
}
