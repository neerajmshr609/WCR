import Hls from 'hls.js';
import Plyr from 'plyr';
import { BehaviorSubject } from 'rxjs';
import {
  PlyrDriver,
  PlyrDriverCreateParams,
  PlyrDriverDestroyParams,
  PlyrDriverUpdateSourceParams,
} from 'ngx-plyr-mg';

export class HlsPlyrDriver implements PlyrDriver {
  hls: Hls;
  loaded = false;

  level$ = new BehaviorSubject<number>(null);

  constructor(
    private autoload: boolean,
    private startLevel: number,
  ) {
    this.hls = new Hls({ startLevel: this.startLevel });

    this.hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) =>
      this.level$.next(this.hls.levels[data.level].height),
    );
  }

  create(params: PlyrDriverCreateParams) {
    this.hls.attachMedia(params.videoElement);

    return new Plyr(params.videoElement, params.options);
  }

  updateSource(params: PlyrDriverUpdateSourceParams) {
    if (!params.source.sources) {
      return;
    }

    if (this.autoload) {
      this.load(params.source.sources[0].src);
    } else {
      // poster does not work with autoload
      params.videoElement.poster = params.source.poster;
    }
  }

  load(src: string) {
    if (!this.loaded) {
      this.loaded = true;
      this.hls.loadSource(src);
    }
  }

  destroy(params: PlyrDriverDestroyParams) {
    params.plyr.destroy();
    this.hls.detachMedia();
    this.hls.destroy();
  }
}
