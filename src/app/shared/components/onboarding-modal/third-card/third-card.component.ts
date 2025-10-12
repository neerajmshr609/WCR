import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import Flickity from 'flickity/dist/flickity.pkgd.js';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/shared/models/user.model';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-third-card',
  templateUrl: './third-card.component.html',
  styleUrls: ['./third-card.component.scss'],
})
export class ThirdCardComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('sliderRef') private sliderRef: ElementRef;
  @ViewChild('videoRef') private videoRef: ElementRef;

  @Output() showIframe = new EventEmitter();

  mainSlider;
  img = 3;
  currentUser: User;
  showVideos: boolean;
  videosHeight: number;

  public playerOptions: Plyr.Options = {
    controls: ['play', 'progress'],
    storage: { enabled: false },
    autoplay: true,
    loop: { active: true },
    hideControls: true,
  };

  public playerVars = {
    rel: 0,
    showinfo: 0,
    enablejsapi: 1,
    origin: location.origin,
  };
  public height: number;

  private readonly folder = '/assets/gif/onboarding';
  public videos = [
    this.folder + '-1.gif',
    this.folder + '-2.gif',
    this.folder + '-3.gif',
    this.folder + '-4.gif',
    this.folder + '-5.gif',
  ];

  constructor(
    private authService: AuthService,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.authService.userSubject$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
      )
      .subscribe((res) => {
        this.currentUser = res;
      });
  }

  ngAfterViewInit() {
    this.elRef.nativeElement.parentElement.parentElement.parentElement.style.paddingBottom = 0;
    this.initSliders();
    this.onResize();
  }

  initSliders() {
    this.mainSlider = new Flickity(this.sliderRef.nativeElement, {
      setGallerySize: false,
      selectedAttraction: 0.25,
      friction: 0.8,
      contain: true,
      draggable: true,
      pageDots: true,
      prevNextButtons: true,
      wrapAround: true,
      autoPlay: 20000,
      pauseAutoPlayOnHover: true,
    });

    this.mainSlider.on('change', (index) => (this.img = index + 3));
  }

  toggleUserTutorials() {
    this.authService
      .updateUser({
        ...this.currentUser,
        showtutorials: !this.currentUser.showtutorials,
      })
      .subscribe();
  }

  private resizeVideo() {
    this.showVideos = false;

    const slider = this.sliderRef.nativeElement as HTMLElement;
    const sliderHeight = slider.offsetHeight;
    const width = this.videoRef.nativeElement.getBoundingClientRect().width;

    const height = (width * 9) / 16 - 3;
    this.height = height > sliderHeight - 110 ? sliderHeight - 110 : height;
  }

  private resizePlyr() {
    const slider = this.sliderRef.nativeElement as HTMLElement;
    const video = slider.querySelector('.slide__video');
    this.videosHeight = video.clientHeight;
    this.showVideos = true;
  }

  @HostListener('window:resize') onResize() {
    this.resizeVideo();
    this.resizePlyr();
    this.cdr.detectChanges();
  }
}
