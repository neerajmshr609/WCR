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
  selector: 'app-welcome-animation-2',
  templateUrl: './welcome-animation-2.component.html',
  styleUrls: ['./welcome-animation-2.component.scss'],
})
export class WelcomeAnimation2Component implements AfterViewInit, OnDestroy {
  @ViewChild('cardRef') cardRef: ElementRef<HTMLElement>;
  @ViewChild('footerRef') footerRef: ElementRef<HTMLElement>;
  @ViewChild('buttonRef') buttonRef: ElementRef<HTMLElement>;
  @ViewChild('textRef') textRef: ElementRef<HTMLElement>;

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
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.whyService.firstCardEnded$.next(false);
    this.typewriter.stop();
  }

  @HostListener('window:resize') onResize() {
    const card = this.cardRef.nativeElement;
    const height = card.clientHeight;
    const width = card.clientWidth;

    card.style.setProperty('--size-88-px', width * 0.22278481 + 'px');
    card.style.setProperty('--size-59-px', width * 0.149367089 + 'px');
    card.style.setProperty('--size-36-px', width * 0.0911392405 + 'px');

    const textHeight = this.textRef.nativeElement.clientHeight;
    const btnBlockHeight = (height - textHeight) / 4;
    this.buttonRef.nativeElement.style.top = `${btnBlockHeight}px`;

    setTimeout(() => {
      const textWidth = this.cardRef.nativeElement.querySelector(
        '.typewriter--insight',
      ).clientWidth;
      const cardWidth = this.cardRef.nativeElement.clientWidth;
      this.footerRef.nativeElement.style.left = `${(cardWidth - textWidth) / 2}px`;
    });
  }
}
