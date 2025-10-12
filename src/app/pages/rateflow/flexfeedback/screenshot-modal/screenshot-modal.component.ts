import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface Tutorial {
  name: string;
  os: string;
  image: string;
  video?: string;
}

@Component({
  selector: 'app-screenshot-modal',
  templateUrl: './screenshot-modal.component.html',
  styleUrls: ['./screenshot-modal.component.scss'],
})
export class ScreenshotModalComponent implements OnInit {
  @Output() saveFile = new EventEmitter<void>();
  @Output() openCropper = new EventEmitter<void>();
  @Output() openBrowser = new EventEmitter<void>();
  public isDisabled$: Observable<boolean> = fromPromise(
    (navigator as any).clipboard.read(),
  ).pipe(map((item) => !item[0] || !/image/.test(item[0].types[0])));
  public showVideo: boolean;
  public videoLoading: boolean;

  selectedTutorial: Tutorial;
  private readonly folder = 'assets/screenshot-modal/';
  tutorials: Tutorial[] = [
    {
      name: 'Windows',
      os: 'Windows',
      image: this.folder + 'windows.svg',
      video: this.folder + 'Windows.mp4',
    },
    {
      name: 'Mac OS',
      os: 'Mac',
      image: this.folder + 'mac.svg',
      video: this.folder + 'Mac.mp4',
    },
    {
      name: 'IOS',
      os: 'iOS',
      image: this.folder + 'iphone.svg',
    },
    {
      name: 'Android',
      os: 'Android',
      image: this.folder + 'android.svg',
    },
    {
      name: 'Linux',
      os: 'Linux',
      image: this.folder + 'linux.svg',
    },
  ];

  playerOptions = {
    autoplay: true,
    controls: [
      'play-large',
      'play',
      'progress',
      'mute',
      'volume',
      'fullscreen',
    ],
    storage: {
      enabled: false,
    },
  };

  constructor(private deviceService: DeviceDetectorService) {}

  ngOnInit(): void {
    const os = this.deviceService.os;
    this.selectedTutorial =
      this.tutorials.find((tutor) => tutor.os === os) || this.tutorials[0];
  }

  public selectTutorial(item: Tutorial) {
    this.showVideo = false;
    this.videoLoading = false;

    const img = new Image();
    img.src = item.image;

    const image = document.querySelector('.tutorial__image') as HTMLElement;
    image.style.opacity = '0';

    setTimeout(() => {
      this.selectedTutorial = item;
      image.style.opacity = '1';
    }, 200);
  }

  public playVideo() {
    this.showVideo = true;
    this.videoLoading = true;

    const video = document.createElement('video');
    video.oncanplaythrough = () => (this.videoLoading = false);

    video.src = this.selectedTutorial.video;
    video.load();
  }

  public save() {
    this.saveFile.emit();
  }
}
