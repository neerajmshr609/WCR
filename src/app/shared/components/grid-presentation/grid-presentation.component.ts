import {
  AfterViewInit,
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Projectfile } from '../../models/projectfile.model';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-grid-presentation',
  templateUrl: './grid-presentation.component.html',
  styleUrls: ['./grid-presentation.component.scss'],
})
export class GridPresentationComponent
  extends BaseComponent
  implements AfterViewInit
{
  @ViewChild('gallery') gallery: ElementRef;
  @Input() projectFiles: Projectfile[];
  @Output() clickItem = new EventEmitter();

  public changesEvt = new EventEmitter<void>();

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.calcGrid();
  }

  calcGrid() {
    if (!this.gallery || !this.projectFiles) {
      return;
    }

    const galleryElem = this.gallery.nativeElement as HTMLElement;
    const numberOfFiles = this.projectFiles.length;
    const width = galleryElem.clientWidth;

    let forSmall = 2;
    let forBig = 3;

    if (numberOfFiles === 1) {
      forSmall = 1;
    } else if (numberOfFiles > 9) {
      forBig = 4;
    } else if (numberOfFiles <= 3) {
      forBig = numberOfFiles;
    }

    if (width > 500) {
      galleryElem.style.gridTemplateColumns = `repeat(${forBig}, minmax(0, 1fr))`;
    }

    if (width < 360) {
      galleryElem.style.gridTemplateColumns = `repeat(${forSmall}, minmax(0, 1fr))`;
    }

    setTimeout(() => this.changesEvt.emit());
  }

  @HostListener('window:resize') onResize() {
    this.calcGrid();
  }
}
