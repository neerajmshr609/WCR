import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Typewriter from 'typewriter-effect/dist/core';
import { WhyService } from '../why.service';

@Component({
  selector: 'app-welcome-animation-3',
  templateUrl: './welcome-animation-3.component.html',
  styleUrls: ['./welcome-animation-3.component.scss'],
})
export class WelcomeAnimation3Component implements AfterViewInit, OnDestroy {
  @ViewChild('cardRef') cardRef: ElementRef<HTMLElement>;
  @ViewChild('footerRef') footerRef: ElementRef<HTMLElement>;
  @ViewChild('imgRef') imgRef: ElementRef<HTMLElement>;
  @ViewChild('bodyRef') bodyRef: ElementRef<HTMLElement>;

  private interval: any;
  private typewriter: Typewriter;

  constructor(
    private whyService: WhyService,
    public sanitizer: DomSanitizer,
  ) {}

  ngAfterViewInit(): void {
    this.typewriter = new Typewriter(this.footerRef.nativeElement, {
      delay: 40,
      cursor: '',
    });

    this.typewriter
      .pauseFor(1500)
      .typeString(
        '<p class="typewriter--small">Developed <br> by creatives,</p>',
      )
      .pauseFor(500)
      .changeDelay(100)
      .typeString(
        '<p class="typewriter--small typewriter--black">for all creatives</p>',
      )
      .pauseFor(300)
      .callFunction(() => this.whyService.firstCardEnded$.next(true))
      .start();

    this.onResize();

    const img = new Image();
    img.onload = () => this.placeFooter();
    img.src = 'assets/why/welcome-3.svg';
  }

  private placeFooter() {
    if (!this.imgRef) {
      return;
    }

    setTimeout(() => {
      const width = this.imgRef.nativeElement.clientWidth;
      const padding = width * 0.027;
      const cardWidth = this.cardRef.nativeElement.clientWidth;
      this.footerRef.nativeElement.style.paddingLeft = `${(cardWidth - width) / 2 + padding}px`;
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.whyService.firstCardEnded$.next(false);
    this.typewriter.stop();
  }

  @HostListener('window:resize') onResize() {
    const card = this.cardRef.nativeElement;
    const height = card.clientHeight;

    card.style.setProperty('--size-36-px', height * 0.05454 + 'px');

    this.placeFooter();
  }
}
