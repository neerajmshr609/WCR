import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import Flickity from 'flickity/dist/flickity.pkgd.js';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { cardFlip } from 'src/app/shared/animations';
import {
  WhyCardType,
  avYTStateEnum,
  WhyCardTypeEnum,
} from 'src/app/shared/enums';
import { WhyCard } from 'src/app/shared/models/whycardviewmodel.model';

@Component({
  selector: 'app-whycard',
  templateUrl: './whycard.component.html',
  styleUrls: ['./whycard.component.scss'],
  animations: [cardFlip],
})
export class WhycardComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('whyCardRef') whyCardRef: ElementRef;
  @ViewChild('cardRef') cardRef: ElementRef;

  @Input() subCat: string;
  @Input() card: WhyCard;
  @Input() nowPlaying$: Observable<string>;

  @Output() ytPlayerStateChange = new EventEmitter();
  @Output() selectedCardCategoryChange = new EventEmitter();
  @Output() subCatChange = new EventEmitter<string>();

  hover: boolean;

  mainSlider: Flickity;
  cardTypes = WhyCardType;
  titleSafe: SafeResourceUrl;

  showVideo: boolean;
  videoLoading: boolean;
  youtubePlayer: any;
  playerVars = {
    rel: 0,
    showinfo: 0,
    enablejsapi: 1,
    origin: location.origin,
  };

  selectedCategory: string;
  manifestVideoState = 'default';

  public size30: number;
  public fontSize: number;

  constructor(public sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    this.titleSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.card.title,
    );

    this.nowPlaying$
      ?.pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        filter(
          (res) =>
            res !== this.card.videoURL &&
            this.youtubePlayer?.getPlayerState() === avYTStateEnum.playing,
        ),
        tap(() => this.youtubePlayer.pauseVideo()),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    if (this.card.type === WhyCardTypeEnum.how_intro_card) {
      this.selectedCategory = this.selectedCategory || 'advisers';
    }

    this.initSliders();
    this.onResize();
  }

  private resizeText() {
    if (
      this.card.type === WhyCardTypeEnum.step_card_quick_advice ||
      this.card.type === WhyCardTypeEnum.step_card_long_terms
    ) {
      const img = new Image();
      img.onload = () => {
        setTimeout(() => {
          const card = this.cardRef.nativeElement;
          const height =
            card.clientHeight -
            card.querySelector('.step_card-image').clientHeight -
            this.size30 * 2;
          const linesCount = this.card.text.split('<br>').length;
          const fontSize = height / 1.2 / linesCount;
          this.fontSize = fontSize > 23 ? 23 : Math.floor(fontSize);
        });
      };
      img.src = this.card.imageURL;
    }
  }

  initSliders() {
    if (
      this.card.type === WhyCardTypeEnum.video_card ||
      this.card.type === WhyCardTypeEnum.video_intro_card ||
      this.card.type === WhyCardTypeEnum.step_card_quick_advice ||
      this.card.type === WhyCardTypeEnum.step_card_long_terms ||
      this.card.type === WhyCardTypeEnum.how_intro_card ||
      this.card.type === WhyCardTypeEnum.types_of_advice_card
    ) {
      return;
    }

    const isSkipCard = this.card.type === WhyCardTypeEnum.skip_card;

    if (!this.whyCardRef) {
      return;
    }

    this.mainSlider = new Flickity(this.whyCardRef.nativeElement, {
      setGallerySize: false,
      selectedAttraction: 0.25,
      friction: 0.8,
      contain: true,
      draggable: true,
      pageDots: true,
      prevNextButtons: !isSkipCard,
      wrapAround: isSkipCard,
      ...(isSkipCard && {
        autoPlay: 15000,
        pauseAutoPlayOnHover: false,
      }),
    });

    if (isSkipCard) {
      const skipTextElem = document.querySelector('.changing-color');
      let currentColor = 'green';

      this.mainSlider.on('change', (event) => {
        const scrollItem = this.card.scrollItems[event];

        skipTextElem.classList.remove('changing-color--' + currentColor);
        currentColor = scrollItem.colorClassName;
        skipTextElem.classList.add('changing-color--' + currentColor);
      });

      this.mainSlider.on('pointerUp', (event, pointer) =>
        this.mainSlider.player.play(),
      );
    }
  }

  onPlayClick() {
    this.showVideo = true;
    this.videoLoading = true;

    if (this.youtubePlayer) {
      this.videoLoading = false;
      this.youtubePlayer.playVideo();
    }
  }

  onYTPlayerReady(event: any) {
    this.youtubePlayer = event.target;

    if (this.showVideo) {
      this.videoLoading = false;
      this.youtubePlayer.playVideo();
    }
  }

  onYTPlayerStateChange(event) {
    if (event.data === avYTStateEnum.playing) {
      this.ytPlayerStateChange.emit(event.target.videoId);
    }

    if (event.data === avYTStateEnum.ended) {
      this.manifestVideoState = 'flipped';
      setTimeout(() => {
        this.initSliders();
      });
    }
  }

  selectCategory(category: string) {
    if (this.selectedCategory === category) {
      return;
    }

    this.selectedCategory = category;
    this.selectedCardCategoryChange.emit(this.selectedCategory);
    this.changeSubCat(WhyCardTypeEnum.step_card_long_terms);
  }

  changeSubCat(subCat: string) {
    this.subCatChange.emit(subCat);
  }

  private calculateVariables() {
    const card = this.cardRef.nativeElement as HTMLElement;
    const height = card.clientHeight;
    const defaultHeight = 660;

    let s200 = height * 0.28;
    let s150 = height * 0.22255;

    if (height > 600) {
      s200 = height * 0.3;
    }

    if (height < 490) {
      s200 = height * 0.25;
      s150 = height * 0.19;
    }

    card.style.setProperty('--size-200-px', s200 + 'px');
    card.style.setProperty('--size-150-px', s150 + 'px');

    card.style.setProperty('--size-126-px', height * 0.1869 + 'px');
    card.style.setProperty('--size-100-px', height * 0.1515 + 'px');
    card.style.setProperty('--size-86-px', height * 0.12759 + 'px');
    card.style.setProperty('--size-66-px', height * 0.1 + 'px');
    card.style.setProperty('--size-52-px', height * 0.07715 + 'px');
    card.style.setProperty('--size-45-px', height * 0.0667 + 'px');
    card.style.setProperty('--size-41-px', height * 0.06083 + 'px');
    card.style.setProperty('--size-32-px', height * 0.04747 + 'px');
    card.style.setProperty('--size-30-px', height * 0.04451 + 'px');
    card.style.setProperty('--size-26-px', height * 0.03857 + 'px');
    card.style.setProperty('--size-24-px', height * 0.0356 + 'px');
    card.style.setProperty('--size-22-px', height * 0.03264 + 'px');
    card.style.setProperty('--size-20-px', height * 0.0296 + 'px');
    card.style.setProperty('--size-12-px', height * 0.0178 + 'px');

    let size16 = height * 0.023738;
    size16 = size16 > 14 ? size16 : 14;
    card.style.setProperty('--size-16-px', size16 + 'px');

    if (
      this.card.type === this.cardTypes.step_card_quick_advice ||
      this.card.type === this.cardTypes.step_card_long_terms
    ) {
      const img = new Image();
      img.onload = () => {
        const imageHeight = img.height;
        card.style.setProperty(
          '--step-image-height',
          height * (imageHeight / defaultHeight) + 'px',
        );
      };
      img.src = this.card.imageURL;
    }

    this.size30 = height * 0.04451;
  }

  @HostListener('window:resize') onResize() {
    this.calculateVariables();
    this.resizeText();
  }
}
