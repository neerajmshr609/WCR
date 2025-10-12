import {
  ChangeDetectorRef,
  EventEmitter,
  input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AudioRecordingService } from 'src/app/services/audio-recorder';
import { User } from '../../models/user.model';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-audio-message',
  templateUrl: './audio-message.component.html',
  styleUrls: ['./audio-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AudioRecordingService],
})
export class AudioMessageComponent implements OnInit, OnChanges {
  @ViewChild('plyrContainerRef') plyrContainerRef: ElementRef;
  @ViewChild('wrapperRef') wrapperRef: ElementRef;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  // @Input() audioMessage: AudioMessage;
  @Input() user: User;
  @Input() paymentRequestAmount: number;
  @Input() disablePreload = false;

  @Input() canSelectLanguage = false;
  @Input() set languages(languages: string[] | string) {
    if (Array.isArray(languages)) {
      this.languageList.set(languages);
    }
    if (typeof languages === 'string') {
      this.languageList.set(languages.split(','));
    }
  }
  @Output() selectLang = new EventEmitter<string>();
  public languageList = signal<string[]>(null);
  public direction = input<'left' | 'right'>(null);
  public audioMessage = input(null);
  public plyrSources: Plyr.Source[];
  public playerOptions = {
    controls: ['play', 'progress', 'current-time'],
    autoplay: true,
    iconUrl: 'assets/player-redesign/play.svg',
  };

  public loaded: boolean;
  public loading: boolean;
  public language: string;

  private get timerElem(): HTMLElement {
    return this.wrapperRef?.nativeElement.querySelector('.plyr__time');
  }

  constructor(
    private audioRecordingService: AudioRecordingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.plyrSources = [
      {
        src: this.audioMessage().url,
        type: 'audio/wav',
      },
    ];

    if (this.disablePreload) {
      this.playerOptions.autoplay = false;
      this.loaded = true;
    }

    this.language = this.audioMessage().language;
    if (!this.languageList()?.includes(this.language)) {
      this.language = this.audioRecordingService.getLastUsedLanguage(
        this.languageList(),
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.audioMessage &&
      (!this.audioMessage().url ||
        changes.audioMessage.currentValue.url !== this.audioMessage().url)
    ) {
      this.plyrSources = [
        {
          src: changes.audioMessage.currentValue.url,
          type: 'audio/wav',
        },
      ];
      setTimeout(() => {
        if (this.timerElem) {
          this.timerElem.addEventListener('click', () =>
            this.openDropDownMenu(),
          );
          this.timerElem.setAttribute('data-lang', this.language);
        }
      });
    }
  }

  public openDropDownMenu(): void {
    if (!this.canSelectLanguage) {
      return;
    }

    this.trigger.openMenu();
  }

  public load(event: MouseEvent) {
    event.stopPropagation();

    if (this.loading) {
      return;
    }

    this.loading = true;

    const audio = new Audio();
    audio.oncanplaythrough = this.onCanPlay.bind(this);

    audio.src = this.audioMessage().url;
    audio.load();
  }

  public onSelect(lang: string): void {
    this.language = lang;
    this.audioMessage().language = lang;

    this.selectLang.emit(this.language);

    localStorage.setItem('audioMsgLang', this.language);

    if (this.timerElem) {
      this.timerElem.setAttribute('data-lang', this.language);
    }
  }

  private onCanPlay() {
    this.loading = false;
    this.loaded = true;

    this.cdr.detectChanges();

    if (this.timerElem) {
      this.timerElem.addEventListener('click', () => this.openDropDownMenu());
      this.timerElem.setAttribute('data-lang', this.language);
    }
  }
}
