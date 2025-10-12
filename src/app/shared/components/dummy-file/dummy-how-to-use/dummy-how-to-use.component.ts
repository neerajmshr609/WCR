import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dummy-how-to-use',
  templateUrl: './dummy-how-to-use.component.html',
  styleUrls: ['./dummy-how-to-use.component.scss'],
})
export class DummyHowToUseComponent implements OnInit {
  public showVideo: boolean;
  public videoLoading: boolean;
  public readonly videoSrc = '/assets/dummy/dummy-explainer.mp4';

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

  constructor() {}

  ngOnInit(): void {}

  public playVideo() {
    this.showVideo = true;
    this.videoLoading = true;

    const video = document.createElement('video');
    video.oncanplaythrough = () => (this.videoLoading = false);

    video.src = this.videoSrc;
    video.load();
  }
}
