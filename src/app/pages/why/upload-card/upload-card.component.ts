import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-upload-card',
  templateUrl: './upload-card.component.html',
  styleUrls: ['./upload-card.component.scss'],
})
export class UploadCardComponent implements OnInit, AfterViewInit {
  @ViewChild('cardRef') cardRef: ElementRef<HTMLElement>;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.onResize();
  }

  @HostListener('window:resize') onResize() {
    const card = this.cardRef.nativeElement as HTMLElement;
    const height = card.clientHeight;

    card.style.setProperty('--img-height', height * 0.45 + 'px');
    card.style.setProperty('--size-36-px', height * 0.05454 + 'px');
  }
}
