import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { WhyService } from '../why.service';
import Typewriter from 'typewriter-effect/dist/core';

@Component({
  selector: 'app-maze-animation',
  templateUrl: './maze-animation.component.html',
  styleUrls: ['./maze-animation.component.scss'],
})
export class MazeAnimationComponent extends BaseComponent implements OnInit {
  @ViewChild('cardRef') cardRef: ElementRef<HTMLElement>;
  @ViewChild('headerRef') headerRef: ElementRef<HTMLElement>;
  @ViewChild('footerRef') footerRef: ElementRef<HTMLElement>;
  @ViewChild('bridgeRef') bridgeRef: ElementRef<HTMLElement>;
  @ViewChild('mazeRef') mazeRef: ElementRef<HTMLElement>;
  @ViewChild('dudeRef') dudeRef: ElementRef<HTMLElement>;
  @ViewChild('bodyRef') bodyRef: ElementRef<HTMLElement>;

  public showMaze = true;
  public showBridge: boolean;
  public showDude: boolean;

  private dudeLeft: number;
  private dudeTop: number;
  private dudeCenter: number;

  private mazeLoaded: boolean;
  private dudeLoaded: boolean;

  constructor(public whyService: WhyService) {
    super();
  }

  ngOnInit() {
    this.preloadImage('maze');
    this.preloadImage('bridge');
    this.preloadImage('dude');

    this.whyService.firstCardEnded$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => res),
        tap(() => this.checkInit()),
      )
      .subscribe();
  }

  private checkInit() {
    if (!this.dudeLoaded || !this.mazeLoaded) {
      setTimeout(() => {
        this.checkInit();
      }, 100);
    } else {
      this.init();
    }
  }

  private preloadImage(name: string) {
    const img = new Image();
    img.src = `assets/why/${name}.svg`;

    img.onload = () => {
      if (name === 'dude') {
        this.dudeLoaded = true;
        this.resizeElements();
      }

      if (name === 'maze') {
        this.mazeLoaded = true;
        this.resizeElements();
      }
    };
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

    const dude = this.dudeRef.nativeElement;

    typewriterHeader
      .typeString('<span class="typewriter">Speed up</span>')
      .pauseFor(400)
      .callFunction(() => (this.showBridge = true))
      .pauseFor(600)
      .callFunction(() => (this.showDude = true))
      .pauseFor(700)
      .callFunction(() => {
        dude.style.transition = '0.4s linear all';
        dude.style.top = this.dudeCenter + 'px';
        dude.style.left = this.dudeLeft / 1.7 + 'px';
      })
      .pauseFor(300)
      .callFunction(() => {
        dude.style.top = this.dudeTop + 'px';
        dude.style.left = this.dudeLeft + 'px';
      })
      .pauseFor(700)
      .callFunction(() => {
        typewriterFooter
          .typeString('<span class="typewriter">your career</span>')
          .start();
      })
      .start();

    this.onResize();
  }

  private resizeElements() {
    if (!this.dudeLoaded || !this.mazeLoaded) {
      return;
    }

    setTimeout(() => {
      const dude = this.dudeRef.nativeElement;
      const body = this.bodyRef.nativeElement;
      const bridge = this.bridgeRef.nativeElement;

      const width = this.mazeRef.nativeElement.clientWidth;
      bridge.style.width = `${width}px`;

      const bodyWidth = body.clientWidth;
      const bodyHeight = body.clientHeight;
      const bridgeHeight = bridge.clientHeight;
      const dudeWidth = width * 0.174;
      const dudeHeight = dudeWidth / 0.579;

      dude.style.width = `${dudeWidth}px`;
      dude.style.left = `${(bodyWidth - width) / 2 - width * 0.04}px`;
      dude.style.top = `${(bodyHeight - bridgeHeight) / 2 + bridgeHeight - dudeHeight - dudeHeight * 0.13}px`;

      this.dudeLeft = (bodyWidth - width) / 2 + width - width * 0.14;
      this.dudeTop = dudeHeight * -0.25;
      this.dudeCenter = (bodyHeight - bridgeHeight) / 2 - dudeHeight * 0.25;
    });
  }

  @HostListener('window:resize') onResize() {
    const card = this.cardRef.nativeElement as HTMLElement;
    const width = card.clientWidth;

    card.style.setProperty('--size-36-px', width * 0.0952 + 'px');
    card.style.setProperty('--size-42-px', width * 0.1111 + 'px');
  }
}
