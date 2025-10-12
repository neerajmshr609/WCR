import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnChanges,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Typewriter from 'typewriter-effect/dist/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ResizeService } from '../../../services/resize.service';
import { combineLatest, interval } from 'rxjs';
import { startWith } from 'rxjs/operators';

const defaultConfig = {
  fontSizes: {
    en: [38, 48],
    de: [40, 50],
    ru: [34, 44],
    uk: [34, 44],
  },
  bgColor: '#535449',
  textColor: '#E7FFC1',
  textColorSecond: '#FFFFFF',
  repeat: false,
};

export type TypingCardConfig = typeof defaultConfig;
@Component({
  selector: 'app-typing-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typing-card.component.html',
  styleUrls: ['./typing-card.component.scss'],
})
export class TypingCardComponent implements AfterViewInit, OnChanges {
  @ViewChild('typingCard', { static: true }) container: ElementRef;
  public textSplitter = input('|');
  public textWithSplit = input.required<string>();
  public secondTextWithSplit = input<string>();
  public config = input<TypingCardConfig>(defaultConfig);

  public fontSize = signal(48);
  private destroyRef = inject(DestroyRef);

  constructor(
    private translateService: TranslateService,
    private resizeService: ResizeService,
  ) {}

  private listenLangChange(): void {
    combineLatest([
      this.resizeService.isSmallest$,
      this.translateService.onLangChange,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([isSmaller, value]) => {
        const lang = value.lang;

        if (lang === 'en') {
          this.fontSize.set(this.getFontSize('en', isSmaller));
        }

        if (lang === 'de') {
          this.fontSize.set(this.getFontSize('de', isSmaller));
        }

        if (lang === 'ru') {
          this.fontSize.set(this.getFontSize('ru', isSmaller));
        }

        if (lang === 'uk') {
          this.fontSize.set(this.getFontSize('uk', isSmaller));
        }
      });
  }

  private getFontSize(
    lang: 'ru' | 'en' | 'uk' | 'de',
    isSmaller: boolean,
  ): number {
    const fontSizes = this.config().fontSizes;
    const mobileSize =
      fontSizes && fontSizes[lang] && fontSizes[lang][0]
        ? fontSizes[lang][0]
        : defaultConfig.fontSizes[lang][0];
    const desktopSize =
      fontSizes && fontSizes[lang] && fontSizes[lang][1]
        ? fontSizes[lang][1]
        : defaultConfig.fontSizes[lang][1];
    return isSmaller ? mobileSize : desktopSize;
  }

  ngAfterViewInit(): void {
    this.listenLangChange();
  }

  private startTyping(): void {
    const typewriter = new Typewriter(this.container.nativeElement, {
      delay: 75,
      cursor: '',
      loop: false,
    });
    if (this.config().repeat) {
      interval(9000)
        .pipe(startWith(0), takeUntilDestroyed(this.destroyRef))
        .subscribe((_) => {
          typewriter.changeDelay(1);
          typewriter.pauseFor(2500);
          typewriter.deleteAll();
          typewriter.pauseFor(1000);
          typewriter.changeDelay(75);
          this.typing(typewriter);
        });
    } else {
      typewriter.pauseFor(2500);
      this.typing(typewriter);
    }
  }

  private typing(typewriter: Typewriter): void {
    this.typeText(typewriter, this.textWithSplit());
    if (this.secondTextWithSplit()) {
      typewriter.pauseFor(1000);
      typewriter.deleteAll();
      this.typeText(typewriter, this.secondTextWithSplit());
    }
  }

  private typeText(typewriter: Typewriter, text: string): void {
    const wordArray = text.split(this.textSplitter());
    const secondColor = this.config().textColorSecond
      ? this.config().textColorSecond
      : defaultConfig.textColorSecond;
    const textColor = this.config().textColor
      ? this.config().textColor
      : defaultConfig.textColor;
    wordArray.forEach((textLine, index) => {
      const isLast = index === wordArray.length - 1;
      const text = isLast
        ? `<br><span style="color:${secondColor};" class="typing-second">${textLine}</span>`
        : `<span style="color:${textColor};" class="typing-default">${textLine}</span>`;
      if (isLast) {
        typewriter.pauseFor(800);
      }
      typewriter.typeString(text);
    });
    typewriter.start();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.textWithSplit.currentValue) {
      this.startTyping();
    }
  }
}
