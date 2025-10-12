import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  HostListener,
  ChangeDetectorRef,
  signal,
} from '@angular/core';
import Flickity from 'flickity/dist/flickity.pkgd.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { Feedbackobject } from 'src/app/shared/models/feedbackobject.model';
import { Project } from 'src/app/shared/models/project.model';
import { FilePreviewOverlayService } from 'src/app/services/file-preview-overlay.service';
import { RateflowService } from 'src/app/services/rateflow.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { DummyFileComponent } from '../dummy-file/dummy-file.component';

interface Coord {
  x: number;
  y: number;
}

@Component({
  selector: 'app-presentation-slider',
  templateUrl: './presentation-slider.component.html',
  styleUrls: ['./presentation-slider.component.scss'],
})
export class PresentationSliderComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('dummyFileComponent') dummyFileComponent: DummyFileComponent;
  @ViewChild('bigPresentationRef') bigPresentationRef: ElementRef;
  @ViewChild('sliderNavRef') sliderNavRef: ElementRef;
  @ViewChildren('imageRef') imageRefs: QueryList<ElementRef>;

  @Input() onFileSelectChange = new BehaviorSubject<number>(null);
  @Input() isMinimalPresentation = false;

  @Input() isNewsfeedPresentation = false;
  @Input() isRateflowPresentation = false;
  @Input() isSingleFileProject;
  @Input() filesFeedback$: Observable<Feedbackobject>;
  @Input() project: Project;
  @Input() selectedFile: Projectfile;
  @Input() files: Projectfile[];

  @Output() didClose = new EventEmitter<void>();
  @Output() didSelectFile = new EventEmitter<Projectfile>();
  @Output() didSelectProjectInfo = new EventEmitter<void>();
  @Output() didSelectGrid = new EventEmitter<void>();

  public mainSlider: Flickity;
  public horizontalSlider: Flickity;
  public dynamicSlideHeight = signal<string | null>(null);

  private isSelectedFromCard = false;

  private ctx: CanvasRenderingContext2D;
  ratio = 1;
  prev: Coord;
  line: any = null;

  public isFileInfoOpen = false;

  constructor(
    private previewDialog: FilePreviewOverlayService,
    private cdr: ChangeDetectorRef,
    public rateflowService: RateflowService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.rateflowService.playingModeChange
      .pipe(
        takeUntil(this.destroyed),
        tap((res) =>
          this.selectedFile?.avratingparams.forEach((p) => (p.active = res)),
        ),
      )
      .subscribe();
  }

  private positionArrows() {
    if (
      !this.bigPresentationRef ||
      !this.isRateflowPresentation ||
      !this.sliderNavRef
    ) {
      return;
    }
    const remSize = window
      .getComputedStyle(document.documentElement, null)
      .getPropertyValue('font-size');
    const remSizeValue = parseInt(remSize, 10);
    const itemWidth = remSizeValue * 4.5;

    const containerWidth = this.bigPresentationRef.nativeElement.clientWidth;
    const length = this.project.projectfiles.length;
    const navWidth = itemWidth * (length + (length === 1 ? 4 : 5));

    if (navWidth >= containerWidth) {
      this.bigPresentationRef.nativeElement.querySelector(
        '.previous',
      ).style.left = `0`;
      this.bigPresentationRef.nativeElement.querySelector('.next').style.right =
        `0`;
      return;
    }

    const delta = containerWidth - navWidth;
    this.bigPresentationRef.nativeElement.querySelector(
      '.previous',
    ).style.left = `${delta / 2}px`;
    this.bigPresentationRef.nativeElement.querySelector('.next').style.right =
      `${delta / 2}px`;
  }

  draw({ x, y }: Coord) {
    this.ctx.strokeStyle = '#ffff00';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = 2;
    const coord = { x, y };

    if (this.prev) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.prev.x, this.prev.y);
      this.ctx.lineTo(coord.x, coord.y);
      this.ctx.stroke();
    }

    this.prev = coord;
  }

  onSelectOpenImagePreview() {
    this.previewDialog.imageURL = this.selectedFile.url;

    this.previewDialog.open();
  }

  public toggleFileInfo(isToggle?: boolean) {
    if (!isToggle) {
      this.isFileInfoOpen = false;
      return;
    }

    this.isFileInfoOpen = !this.isFileInfoOpen;
  }

  ngAfterViewInit(): void {
    this.initSliders();

    if (
      !this.isMinimalPresentation &&
      this.project.projectfiles &&
      this.project.projectfiles.length === 1
    ) {
      this.mainSlider.next();
    } else {
      this.onFileSelect(this.selectedFile);
    }

    if (this.onFileSelectChange && !this.isMinimalPresentation) {
      this.onFileSelectChange
        .pipe(
          takeUntil(this.destroyed),
          filter((fileIndex) => fileIndex && !this.isSingleFileProject),
        )
        .subscribe((fileIndex) => {
          this.isSelectedFromCard = true;
          this.horizontalSlider.select(fileIndex);
          this.mainSlider.select(fileIndex);
        });
    }

    setTimeout(() => this.positionArrows());
  }

  initSliders() {
    if (!this.isMinimalPresentation) {
      this.mainSlider = new Flickity(this.bigPresentationRef.nativeElement, {
        imagesLoaded: true,
        fullscreen: true,
        lazyLoad: true,
        setGallerySize: false,
        pageDots: false,
        wrapAround: true,
        draggable: false,
      });
    }

    this.horizontalSlider = new Flickity(this.sliderNavRef.nativeElement, {
      setGallerySize: false,
      contain: true,
      pageDots: false,
      prevNextButtons: false,
      ...(!this.isMinimalPresentation && {
        asNavFor: this.bigPresentationRef.nativeElement,
      }),
    });

    this.horizontalSlider.on('change', this.onSelectionChange.bind(this));
    this.horizontalSlider.on('staticClick', () => {
      const prevFileId = this.selectedFile?.id;
      setTimeout(() => {
        if (this.selectedFile?.id === prevFileId) {
          this.toggleFileInfo(true);
        }
      });
    });
    this.mainSlider.on('change', (ev) => {
      setTimeout(() => {
        const presentation = document.getElementsByClassName(
          'slider-presentation',
        )[0];
        if (presentation) {
          const viewport =
            presentation.getElementsByClassName('flickity-viewport')[0];
          this.dynamicSlideHeight.set(viewport.scrollHeight + 'px');
        }
      });
    });
    this.cdr.detectChanges();
  }

  private setHeight(): void {
    const windowHeight = window.innerHeight;
    const pres = document.querySelector(
      '.rateflow__presentation',
    ) as HTMLElement;

    if (!pres) {
      return;
    }

    if (this.selectedFile?.kind === 'dummy' && this.isRateflowPresentation) {
      pres.style.maxHeight = 'unset';
      const tabsRef = this.dummyFileComponent.tabsRef;
      const explainerRef = this.dummyFileComponent.explainerRef;
      pres.style.height = `calc(11rem + ${tabsRef.nativeElement.clientHeight + explainerRef.nativeElement.clientHeight}px)`;
      return;
    }

    pres.style.height = '100%';
  }

  onSelectionChange(index) {
    if (this.isSelectedFromCard) {
      this.isSelectedFromCard = false;
      return;
    }

    if (index === 0) {
      if (this.isSingleFileProject) {
        this.didSelectProjectInfo.emit();
        return;
      }

      this.didSelectGrid.emit();
    } else if (index === 1 && !this.isSingleFileProject) {
      this.didSelectProjectInfo.emit();
    } else {
      const selectedItem = this.isSingleFileProject
        ? this.files[index - 1]
        : this.files[index - 2];
      this.didSelectFile.emit(selectedItem);
    }

    setTimeout(() => this.setHeight());
  }

  manualFileSelect(file) {
    const index = this.files.findIndex((f) => f.id === file.id);
    this.horizontalSlider.select(index + 2);
    this.mainSlider.select(index + 2);
    this.cdr.detectChanges();
  }

  didStartLoadingAudio() {}

  didFinishLoadingAudio() {}

  onSelectInfo() {
    if (this.isSingleFileProject) {
      this.horizontalSlider.select(0);
      this.mainSlider.select(0);
    } else {
      this.horizontalSlider.select(1);
      this.mainSlider.select(1);
    }
  }

  onFileSelect(file: Projectfile) {
    if (this.isMinimalPresentation) {
      return;
    }

    const fileIndex = this.files.indexOf(file);
    if (this.isSingleFileProject) {
      this.horizontalSlider.select(fileIndex);
      this.mainSlider.select(fileIndex);
    } else {
      this.horizontalSlider.select(fileIndex + 1);
      this.mainSlider.select(fileIndex + 1);
    }
    this.cdr.detectChanges();
  }

  closeDetail() {
    this.didClose.emit();
  }

  @HostListener('window:resize') onResize() {
    setTimeout(() => this.positionArrows());
  }

  setSlideHeight(height: string) {
    // TODO  need implement best fix for video height fix. Probably We will have to change slider lib
    // this.dynamicSlideHeight.set(height);
  }
}
