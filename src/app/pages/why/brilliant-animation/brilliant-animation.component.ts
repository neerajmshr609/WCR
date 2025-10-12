import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import Typewriter from 'typewriter-effect/dist/core';
import { WhyService } from '../why.service';

@Component({
  selector: 'app-brilliant-animation',
  templateUrl: './brilliant-animation.component.html',
  styleUrls: ['./brilliant-animation.component.scss'],
})
export class BrilliantAnimationComponent
  extends BaseComponent
  implements OnInit
{
  @ViewChild('cardRef') cardRef: ElementRef;
  @ViewChild('headerRef') headerRef: ElementRef;
  @ViewChild('footerRef') footerRef: ElementRef;

  public isLamp = false;
  public isIdea = false;

  constructor(public whyService: WhyService) {
    super();
  }

  ngOnInit() {
    this.preloadImage('assets/why/animation-lamp.svg');
    this.preloadImage('assets/why/animation-brilliant-idea.svg');

    this.whyService.firstCardEnded$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => res),
        tap(() => this.init()),
      )
      .subscribe();
  }

  private preloadImage(url) {
    const img = new Image();
    img.src = url;
  }

  private init() {
    const typewriterHeader = new Typewriter(this.headerRef.nativeElement, {
      delay: 60,
      cursor: '',
    });

    const typewriterFooter = new Typewriter(this.footerRef.nativeElement, {
      delay: 60,
      cursor: '',
    });

    typewriterHeader
      .typeString(
        '<span class="typewriter">The<br>fastest way<br>to become</span>',
      )
      .pauseFor(400)
      .callFunction(() => (this.isLamp = true))
      .pauseFor(700)
      .callFunction(() => {
        this.isLamp = false;
        this.isIdea = true;
      })
      .pauseFor(500)
      .callFunction(() => {
        typewriterFooter
          .typeString('<span class="typewriter">a brilliant<br>creative</span>')
          .start();
      })
      .start();

    this.onResize();
  }

  @HostListener('window:resize') onResize() {
    const card = this.cardRef.nativeElement as HTMLElement;
    const height = card.clientHeight;
    const width = window.innerWidth;

    let size = height * 0.0878787879;
    let imageHeight = height * 0.3;

    if (width < 400) {
      size *= 0.8;
      imageHeight = height * 0.35;
    }

    card.style.setProperty('--image-height', imageHeight + 'px');
    card.style.setProperty('--brilliant-animation-font-size', size + 'px');
  }
}
