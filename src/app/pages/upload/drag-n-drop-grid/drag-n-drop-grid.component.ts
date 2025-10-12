import {
  CdkDropListGroup,
  CdkDropList,
  CdkDragMove,
  moveItemInArray,
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { ViewportRuler } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { Uppy, UppyFile } from '@uppy/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AwsS3 } from 'uppy';
import WaveSurfer from '../../../../assets/vendor/wavesurfer/wavesurfer.min';
import html2canvas from 'html2canvas';
import { COMPANION_URL } from 'src/config/config';
import { Projectfile } from 'src/app/shared/models/projectfile.model';

@Component({
  selector: 'app-drag-n-drop-grid',
  templateUrl: './drag-n-drop-grid.component.html',
  styleUrls: ['./drag-n-drop-grid.component.scss'],
})
export class DragNDropGridComponent implements OnInit, AfterViewInit {
  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;

  @Input() items: Array<Projectfile>;
  @Input() files: Array<UppyFile>;
  @Input() public errorAVFiles$: Observable<number[]>;

  @Output() deleteEvt = new EventEmitter<Projectfile>();
  @Output() public showAVHowItWorks = new EventEmitter<null>();
  @Output() public applyToAllFiles = new EventEmitter<Projectfile>();

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  public activeContainer;

  public thumbTime$ = new BehaviorSubject<number>(null);

  thumbUploading: { [id: number]: boolean } = {};
  thumbError: { [id: number]: string } = {};
  uploader = new Uppy({ id: 'thumb-uploader' }).use(AwsS3, {
    companionUrl: COMPANION_URL,
    metaFields: ['folder'],
  });

  wavesurfer: WaveSurfer;

  constructor(
    private viewportRuler: ViewportRuler,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    this.target = null;
    this.source = null;
  }

  onDelete(file: Projectfile) {
    this.deleteEvt.emit(file);
  }

  dragMoved(e: CdkDragMove) {
    const point = this.getPointerPositionOnPage(e.event);

    this.listGroup._items.forEach((dropList) => {
      if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
  }

  dropListDropped(event) {
    if (!this.target) {
      return;
    }

    const phElement = this.placeholder.element.nativeElement;
    const parent = phElement.parentElement;

    phElement.style.display = 'none';

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(
      this.source.element.nativeElement,
      parent.children[this.sourceIndex],
    );

    this.target = null;
    this.source = null;

    if (this.sourceIndex !== this.targetIndex) {
      moveItemInArray(this.items, this.sourceIndex, this.targetIndex);
    }
  }

  public addDuration(file: Projectfile) {
    const createElement = (type: 'audio' | 'video') => {
      const player = document.createElement(type);
      player.crossOrigin = 'anonymous';
      player.src = file.url;
      player.onloadedmetadata = () => (file.duration = player.duration);
      player.load();
    };

    if (file.mimetype.includes('video')) {
      createElement('video');
      return;
    }

    if (file.mimetype.includes('audio')) {
      createElement('audio');
    }
  }

  public getDefaultThumbnail(file: Projectfile): void {
    const videoPlayer = document.createElement('video');
    videoPlayer.crossOrigin = 'anonymous';
    videoPlayer.setAttribute('src', file.url);
    videoPlayer.load();

    videoPlayer.addEventListener('loadedmetadata', () => {
      file.thumbnail_time = Math.floor(videoPlayer.duration / 2) || 1;
      this.thumbTime$.next(file.thumbnail_time);
      this.loadThumb(file.thumbnail_time, file);
    });
  }

  public getAudioThumbnail(file: Projectfile) {
    const container = document.createElement('div');
    container.style.width = '380px';
    document.documentElement.appendChild(container);

    this.wavesurfer = WaveSurfer.create({
      container,
      waveColor: '#DCDCDC',
      progressColor: '#B0B0B0',
      barWidth: 2,
      barRadius: 2,
      cursorColor: 'black',
      cursorWidth: 2,
      barGap: 1,
      barHeight: 1,
      hideScrollbar: true,
    });

    this.wavesurfer.load(file.url);

    const onReady = function () {
      (container.firstChild.firstChild as HTMLElement).style.borderRight =
        'none';
      setTimeout(() => {
        html2canvas(container, {
          useCORS: true,
          scrollX: 0,
          scrollY: -window.scrollY,
        }).then((canvas) => {
          canvas.getContext('2d').canvas.toBlob((blob) => {
            document.documentElement.removeChild(container);
            this.uploadFile(blob, file).then((res) => {
              file.thumbnail = res;
            });
          }, 'image/jpeg');
        });
      }, 100);
    }.bind(this);

    this.wavesurfer.on('ready', onReady);
  }

  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop === this.placeholder) {
      return true;
    }

    if (drop !== this.activeContainer) {
      return false;
    }

    const phElement = this.placeholder.element.nativeElement;
    const sourceElement = drag.dropContainer.element.nativeElement;
    const dropElement = drop.element.nativeElement;

    const dragIndex = __indexOf(
      dropElement.parentElement.children,
      this.source ? phElement : sourceElement,
    );
    const dropIndex = __indexOf(
      dropElement.parentElement.children,
      dropElement,
    );

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';

      sourceElement.parentElement.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentElement.insertBefore(
      phElement,
      dropIndex > dragIndex ? dropElement.nextSibling : dropElement,
    );

    this.placeholder._dropListRef.enter(
      drag._dragRef,
      drag.element.nativeElement.offsetLeft,
      drag.element.nativeElement.offsetTop,
    );
    return false;
  };

  private getVideoCover(seekTo: number, file: Projectfile): Promise<string> {
    return new Promise((resolve, reject) => {
      const videoPlayer = document.createElement('video');
      videoPlayer.crossOrigin = 'anonymous';
      videoPlayer.setAttribute('src', file.url);
      videoPlayer.load();
      videoPlayer.addEventListener('error', (ex) =>
        reject(`Error when loading video file, ${ex}`),
      );

      videoPlayer.addEventListener('loadedmetadata', () => {
        if (videoPlayer.duration < seekTo) {
          reject('The video is too short.');
          return;
        }
        // delay seeking or else 'seeked' event won't fire on Safari
        setTimeout(() => (videoPlayer.currentTime = seekTo), 200);

        videoPlayer.addEventListener('seeked', () => {
          const canvas = document.createElement('canvas');
          canvas.width = videoPlayer.videoWidth;
          canvas.height = videoPlayer.videoHeight;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);

          ctx.canvas.toBlob(
            async (blob) => {
              if (!blob) {
                return reject(
                  "Thumbnail generator doesn't support this video format",
                );
              }

              try {
                const res = await this.uploadFile(blob, file);
                resolve(res);
              } catch (err) {
                reject(err);
              }
            },
            'image/jpeg',
            0.75,
          );
        });
      });
    });
  }

  private async uploadFile(blob: Blob, file: Projectfile): Promise<string> {
    return new Promise(async (resolve, reject) => {
      this.uploader.addFile({
        data: blob,
        name: file.handle + '_thumb.jpg',
        type: 'image/jpeg',
      });

      this.uploader.setMeta({
        folder: `users/${this.authService.userSubject$.value.id}/projects`,
      });

      try {
        const uploadedFiles = await this.uploader.upload();
        this.uploader.reset();

        resolve(
          decodeURIComponent(uploadedFiles.successful[0].uploadURL) +
            '?thumb=' +
            new Date().getTime(),
        );
      } catch (err) {
        reject('An error occured during uploading');
      }
    });
  }

  public addTimeThumb(file: Projectfile, thumbTime: string) {
    const time = thumbTime.split(':').map((item) => +item);
    const timeSeconds = time[0] * 3600 + time[1] * 60 + time[2];

    this.thumbError[file.id] = null;
    this.thumbUploading[file.id] = true;

    this.loadThumb(timeSeconds, file);
  }

  private loadThumb(timeSeconds: number, file: Projectfile) {
    this.getVideoCover(timeSeconds, file).then(
      (res) => {
        file.thumbnail = res;
        file.thumbnail_time = timeSeconds;
        this.thumbUploading[file.id] = false;
        this.cdr.detectChanges();
      },
      (err) => {
        this.thumbError[file.id] = err;
        this.thumbUploading[file.id] = false;
      },
    );
  }

  public addFileThumb(projectFile: Projectfile, imageFile: File) {
    this.thumbError[projectFile.id] = null;
    this.thumbUploading[projectFile.id] = true;

    this.uploadFile(imageFile, projectFile).then(
      (res) => {
        projectFile.thumbnail = res;
        this.thumbUploading[projectFile.id] = false;
        this.cdr.detectChanges();
      },
      (err) => {
        this.thumbError[projectFile.id] = err;
        this.thumbUploading[projectFile.id] = false;
      },
    );
  }

  /** Determines the point of the page that was touched by the user. */
  getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = __isTouchEvent(event)
      ? event.touches[0] || event.changedTouches[0]
      : event;
    const scrollPosition = this.viewportRuler.getViewportScrollPosition();

    return {
      x: point.pageX - scrollPosition.left,
      y: point.pageY - scrollPosition.top,
    };
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    const phElement = this.placeholder.element.nativeElement;

    phElement.style.display = 'none';
    phElement.parentElement.removeChild(phElement);
  }
}

function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
}

/** Determines whether an event is a touch event. */
function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return event.type.startsWith('touch');
}

function __isInsideDropListClientRect(
  dropList: CdkDropList,
  x: number,
  y: number,
) {
  const { top, bottom, left, right } =
    dropList.element.nativeElement.getBoundingClientRect();
  return y >= top && y <= bottom && x >= left && x <= right;
}
