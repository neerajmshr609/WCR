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
  selector: 'app-welcome-animation',
  templateUrl: './welcome-animation.component.html',
  styleUrls: ['./welcome-animation.component.scss'],
})
export class WelcomeAnimationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cardRef') cardRef: ElementRef;
  private interval: any;
  private typewriter: Typewriter;

  constructor(
    private whyService: WhyService,
    public sanitizer: DomSanitizer,
  ) {}

  ngAfterViewInit(): void {
    this.typewriter = new Typewriter(this.cardRef.nativeElement, {
      delay: 30,
      cursor: '',
    });

    this.typewriter
      .pauseFor(1500)
      .typeString('<p class="typewriter--small mb">Welcome to this new</p>')
      .changeDelay(45)
      .typeString(
        '<span class="typewriter--cool" id="centralized">centralized</span>',
      )
      .pauseFor(300)
      .typeString(
        '<br><div class="uncool-container"><span class="typewriter--cool typewriter--yellow" id="un">un</span><span class="typewriter--cool" id="cool">cool</span></div>',
      )
      .pauseFor(300)
      .typeString('<p class="typewriter--career" id="career">career</p><br>')
      .pauseFor(300)
      .changeDelay(30)
      .typeString('<p class="typewriter--school" id="school">school</p>')
      .pauseFor(600)
      .callFunction(() => {
        this.calculateOffset();
        this.interval = setInterval(this.calculateOffset.bind(this), 300);
      })
      .callFunction(() => {
        const createSpan = (text: string) => {
          const span = document.createElement('span');
          span.innerText = text;
          span.classList.add('typewriter--cool', 'typewriter--yellow');
          return span;
        };

        setTimeout(() => {
          const centralized =
            this.cardRef.nativeElement.querySelector('#centralized');
          centralized.prepend(createSpan('e'));
          setTimeout(() => {
            centralized.prepend(createSpan('d'));
            setTimeout(() => {
              this.cardRef.nativeElement.classList.add('done');
            }, 600);
          }, 250);
        }, 300);
      })
      .pauseFor(2500)
      .typeString('<p class="typewriter--small mt">Developed by creatives,</p>')
      .pauseFor(500)
      .changeDelay(80)
      .typeString(
        '<p class="typewriter--small typewriter--black typewriter--bold">for all creatives</p>',
      )
      .pauseFor(300)
      .callFunction(() => this.whyService.firstCardEnded$.next(true))
      .start();

    this.onResize();
  }

  public calculateOffset() {
    const un = this.cardRef.nativeElement.querySelector('#un');
    const cool = this.cardRef.nativeElement.querySelector('#cool');
    const career = this.cardRef.nativeElement.querySelector('#career');
    const school = this.cardRef.nativeElement.querySelector(
      '#school',
    ) as HTMLElement;

    this.cardRef.nativeElement.style.setProperty(
      '--un-offset',
      un?.offsetLeft + 'px',
    );
    this.cardRef.nativeElement.style.setProperty(
      '--cool-offset',
      cool?.offsetLeft + 'px',
    );
    this.cardRef.nativeElement.style.setProperty(
      '--un-left',
      career?.offsetLeft + 'px',
    );
    this.cardRef.nativeElement.style.setProperty(
      '--school-left',
      school?.offsetLeft + 'px',
    );
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.whyService.firstCardEnded$.next(false);
    this.typewriter.stop();
  }

  @HostListener('window:resize') onResize() {
    const defaultHeight = 660;
    const defaultWidth = 400;

    const card = this.cardRef.nativeElement as HTMLElement;
    const height = card.clientHeight;
    const width = window.innerWidth;

    card.style.padding = height * 0.0363636364 + '% 0';

    let small = 0;
    let cool = 0;
    let career = 0;
    let school = 0;

    if (width < defaultWidth) {
      small = width * (30 / defaultWidth);
      cool = width * (40.5 / defaultWidth);
      career = width * (85 / defaultWidth);
      school = width * (60 / defaultWidth);
    }

    const smallForHeight = height * (30 / defaultHeight);
    const coolForHeight = height * (41 / defaultHeight);
    const careerForHeight = height * (85 / defaultHeight);
    const schoolForHeight = height * (60 / defaultHeight);

    small = small && small < smallForHeight ? small : smallForHeight;
    if (small < 22) {
      small = 22;
    }

    card.style.setProperty('--small-font-size', small + 'px');
    card.style.setProperty(
      '--cool-font-size',
      Math.floor(cool && cool < coolForHeight ? cool : coolForHeight) + 'px',
    );
    card.style.setProperty(
      '--career-font-size',
      Math.floor(
        career && career < careerForHeight ? career : careerForHeight,
      ) + 'px',
    );
    card.style.setProperty(
      '--school-font-size',
      Math.floor(
        school && school < schoolForHeight ? school : schoolForHeight,
      ) + 'px',
    );
  }
}
