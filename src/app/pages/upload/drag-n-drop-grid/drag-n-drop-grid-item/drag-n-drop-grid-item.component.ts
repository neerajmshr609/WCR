import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { AVRatingParam } from 'src/app/shared/models/avratingparam.model';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { ProjectService } from 'src/app/services/project.service';
import { AVRatingParamExample } from 'src/app/shared/models/av-rating-param-example';
import { shuffleArray } from 'src/app/shared/functions/shuffle-array';
import { FilePreviewOverlayService } from 'src/app/services/file-preview-overlay.service';

@Component({
  selector: 'app-drag-n-drop-grid-item',
  templateUrl: './drag-n-drop-grid-item.component.html',
  styleUrls: ['./drag-n-drop-grid-item.component.scss'],
})
export class DragNDropGridItemComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  @ViewChild('fileInputRef') private fileInputRef: ElementRef<HTMLElement>;
  @ViewChild('itemRef') private itemRef: ElementRef<HTMLElement>;

  @Input() file: Projectfile;
  @Input() thumbUploading: boolean;
  @Input() thumbError: string;
  @Input() thumbTime$: Observable<number>;
  @Input() private index: number;
  @Input() private errorAVFiles$: Observable<number[]>;

  @Output() dragMoved = new EventEmitter();
  @Output() deleteFile = new EventEmitter();
  @Output() addTimeThumb = new EventEmitter();
  @Output() addFileThumb = new EventEmitter();
  @Output() getDefaultThumbnail = new EventEmitter<void>();
  @Output() getAudioThumbnail = new EventEmitter<void>();
  @Output() addDuration = new EventEmitter<void>();

  @Output() public showAVHowItWorks = new EventEmitter<null>();
  @Output() public applyToAllFiles = new EventEmitter<Projectfile>();

  public thumbTime = new UntypedFormControl(null, Validators.required);
  public thumbInput = new UntypedFormControl(null, Validators.required);
  public fileInput = new UntypedFormControl();
  public thumbnailSrc: string;

  public activeTab = 'description';
  public tabs = [];

  public colors = ['green', 'mustard', 'blue'];
  public placeholders: string[];
  public paramsExamples: AVRatingParamExample[];
  private alreadyShowed = new Array<string>();

  public thumbSrc: string;
  public thumbUploaded: boolean;
  public uploadManually: boolean;

  constructor(
    private projectService: ProjectService,
    private previewDialog: FilePreviewOverlayService,
  ) {
    super();
  }

  public get isFilePdf(): boolean {
    return this.file.mimetype.includes('pdf');
  }

  public get isFileIframe(): boolean {
    return this.file.mimetype.includes('html');
  }

  public get isFileDummy(): boolean {
    return this.file.mimetype.includes('dummy');
  }

  public get isFileImage(): boolean {
    return this.file.mimetype.includes('image');
  }

  public get isVideoNotYoutube(): boolean {
    return this.isFileVideo && !this.isVideoYoutube;
  }

  public get isVideoYoutube(): boolean {
    return this.file.mimetype === 'video/youtube';
  }

  public get isFileAudio(): boolean {
    return this.file.mimetype.includes('audio');
  }

  public get isFileVideo(): boolean {
    return this.file.mimetype.includes('video');
  }

  public get isFileAV(): boolean {
    return this.isFileVideo || this.isFileAudio;
  }

  ngOnInit(): void {
    this.getPlaceholders();
    this.checkParams();
    this.getExamples();
    this.setTabs();
    this.checkDuration();
    this.checkThumbnail();
    this.checkThumbTime();
    this.subscribeToThumbTime();
    this.subscribeToFileInput();
    this.subscribeToErrorAVFiles();
  }

  ngOnChanges(): void {
    this.getThumbSrc();
  }

  private subscribeToErrorAVFiles() {
    this.errorAVFiles$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => res.includes(this.index)),
        tap((res) => {
          this.tabClick('ratings');
          const item = this.itemRef.nativeElement;
          item.classList.add('red-border');

          if (this.index === Math.min(...res)) {
            item.scrollIntoView({ behavior: 'smooth' });
          }

          setTimeout(() => {
            item.classList.remove('red-border');
          }, 3000);
        }),
      )
      .subscribe();
  }

  private subscribeToFileInput() {
    this.fileInput.valueChanges
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        tap((res) => {
          const file = res;
          this.thumbSrc = URL.createObjectURL(file);
        }),
      )
      .subscribe();
  }

  public onSelectOpenImagePreview() {
    this.previewDialog.imageURL = this.thumbnailSrc;
    this.previewDialog.open();
  }

  private getThumbSrc() {
    this.thumbnailSrc = 'assets/projectfiles-types/';

    if (this.isFileImage) {
      this.thumbnailSrc = this.file.url;
    } else if (this.file.thumbnail) {
      this.thumbnailSrc = this.file.thumbnail;
    } else if (this.isFilePdf) {
      this.thumbnailSrc += 'pdf.svg';
    } else if (this.isFileVideo) {
      this.thumbnailSrc += 'video.svg';
    } else if (this.isFileAudio) {
      this.thumbnailSrc += 'audio.svg';
    } else if (this.isFileDummy) {
      this.thumbnailSrc += 'dummy.svg';
    } else if (this.isFileIframe) {
      this.thumbnailSrc += 'iframe.svg';
    }
  }

  private getPlaceholders() {
    this.placeholders = this.isFileAudio
      ? ['Lyrics', 'Melody', 'Bass']
      : ['Acting', 'Camera angles', 'Story'];
  }

  private checkParams() {
    if (this.isFileAV && !this.file.avratingparams?.length) {
      this.clickPlus();
    }
  }

  private getExamples() {
    const examples = this.projectService.avRatingParamsExamples;
    this.paramsExamples = shuffleArray(examples);
  }

  private setTabs() {
    if (this.isFileAV) {
      this.tabs.push(
        ...[
          { name: 'ratings', displayName: 'Rating Setup' },
          { name: 'lyrics', displayName: 'Lyrics' },
        ],
      );
    }

    this.tabs.push({ name: 'description', displayName: 'Description' });
    this.tabs.push({ name: 'thumbnail', displayName: 'Thumbnail' });

    if (this.isFileDummy || this.isFileIframe || this.isVideoYoutube) {
      this.tabs.push({ name: 'link', displayName: 'Link' });
    }

    if (this.isFileAV) {
      this.tabClick('ratings');
      return;
    }

    this.tabClick('description');
  }

  private checkDuration() {
    if ((this.isVideoNotYoutube || this.isFileAudio) && !this.file.duration) {
      this.addDuration.emit();
    }
  }

  private checkThumbnail() {
    if (this.file.thumbnail) {
      return;
    }

    if (this.isVideoNotYoutube) {
      this.getDefaultThumbnail.emit();
    }

    if (this.isFileAudio) {
      this.getAudioThumbnail.emit();
    }
  }

  private checkThumbTime() {
    if (this.file.thumbnail_time) {
      this.setThumbTime(this.file.thumbnail_time);
    }
  }

  public uploadThumbnail(file: File) {
    this.addFileThumb.emit(file);
    this.thumbUploaded = true;
  }

  private subscribeToThumbTime() {
    this.thumbTime$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        tap((res) => this.setThumbTime(res)),
      )
      .subscribe();
  }

  private setThumbTime(seconds: number) {
    this.thumbTime.setValue(
      new Date(seconds * 1000).toISOString().substr(11, 8),
    );
  }

  public pasteFile(event: ClipboardEvent) {
    event.preventDefault();

    const data = event.clipboardData;
    const file = data.files?.[0];

    this.setFileToInput(file);
  }

  public onFileInputChange(files: File[]) {
    const file = files[0];
    this.setFileToInput(file);
  }

  private setFileToInput(file: File) {
    if (!file) {
      return;
    }

    this.thumbUploaded = false;
    this.fileInput.setValue(file);
    this.thumbInput.setValue(file.name);
  }

  public openFileInput() {
    this.fileInputRef.nativeElement.click();
  }

  public clickPlus() {
    if (!this.file.avratingparams) {
      this.file.avratingparams = [];
    }
    this.file.avratingparams.push(new AVRatingParam());
  }

  public tabClick(tab: string) {
    this.activeTab = tab;
  }

  public getExample(index: number) {
    const currentNames = this.file.avratingparams
      .map((param) => param.name)
      .filter((name) => {
        return this.paramsExamples.map((param) => param.body).includes(name);
      });

    if (
      this.alreadyShowed.length ===
      this.paramsExamples.length - currentNames.length
    ) {
      this.alreadyShowed = [];
    }

    const examples = this.paramsExamples.filter((example) => {
      return (
        !currentNames.includes(example.body) &&
        !this.alreadyShowed.includes(example.body)
      );
    });

    const newName = examples[Math.floor(Math.random() * examples.length)].body;
    this.file.avratingparams[index].name = newName;
    this.alreadyShowed.push(newName);
  }
}
