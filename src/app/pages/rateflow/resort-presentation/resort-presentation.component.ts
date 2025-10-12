import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  DoCheck,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Projectfile } from 'src/app/shared/models/projectfile.model';

@Component({
  selector: 'app-resort-presentation',
  templateUrl: './resort-presentation.component.html',
  styleUrls: ['./resort-presentation.component.scss'],
})
export class ResortPresentationComponent implements OnInit, DoCheck {
  @ViewChild('galleryRef') galleryRef: ElementRef;

  @Input() projectfiles: Projectfile[];
  @Input() sortOptions: [];

  @Output() closeResort = new EventEmitter<void>();

  resortToggle: boolean;

  constructor() {}

  ngOnInit() {}

  ngDoCheck() {
    this.calcGrid();
  }

  calcGrid() {
    if (!this.galleryRef) {
      return;
    }

    const numberOfFiles = Number(this.projectfiles.length);
    const galleryElem = this.galleryRef.nativeElement as HTMLElement;
    const width = galleryElem.clientWidth;

    let w;

    if (numberOfFiles === 1) {
      w = 1;
    } else if (numberOfFiles === 2) {
      w = 2;
    } else if (numberOfFiles === 3) {
      w = 2;
    } else if (numberOfFiles === 4) {
      w = 2;
    } else if (numberOfFiles >= 5) {
      w = 3;
    }

    if (numberOfFiles < 5 && width > 500) {
      galleryElem.style.gridTemplateColumns = `repeat(auto-fit, minmax(140px, 170px))`;
    }

    if (width < 360) {
      galleryElem.style.gridTemplateColumns = `repeat(${w}, minmax(0, 1fr))`;
    }
  }
}
