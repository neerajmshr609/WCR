import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-helpnavigation',
  templateUrl: './helpnavigation.component.html',
  styleUrls: ['./helpnavigation.component.scss'],
})
export class HelpnavigationComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @ViewChild('iframe') iframe: ElementRef<HTMLIFrameElement>;
  @ViewChild('buttonRef') buttonRef: ElementRef<HTMLElement>;

  @Input() url: string;
  @Input() toggle: Observable<void>;
  @Input() hidden: boolean;
  @Input() private page: string;

  @Output() closed = new EventEmitter();

  src: SafeResourceUrl;
  control = new UntypedFormControl();

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.toggle?.subscribe(() => this.control.setValue(true));

    this.control.valueChanges.pipe(filter((res) => !res)).subscribe(() => {
      this.closed.emit();
      this.stopVideo();
    });
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem(this.page)) {
      this.setAnimationNone();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes &&
      changes.url &&
      changes.url.currentValue !== changes.url.previousValue
    ) {
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.youtube.com/embed/' +
          this.url +
          '?cc_load_policy=1&yt:cc=on&enablejsapi=1',
      );
    }
  }

  stopVideo() {
    const el = this.iframe.nativeElement;
    el.contentWindow.postMessage(
      '{"event":"command","func":"stopVideo","args":""}',
      '*',
    );
  }

  setAnimationNone() {
    this.buttonRef.nativeElement.style.animation = 'none';
  }

  disablePulse() {
    localStorage.setItem(this.page, 'true');
    this.setAnimationNone();
  }
}
