import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-pdf-modal',
  templateUrl: './preview-pdf-modal.component.html',
  styleUrls: ['./preview-pdf-modal.component.scss'],
})
export class PreviewPdfModalComponent implements OnInit {
  @ViewChild('containerRef') containerRef: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}

  ngOnInit(): void {}

  pageInitialized() {
    this.containerRef.nativeElement.querySelector(
      '.ng2-pdf-viewer-container',
    ).style.position = 'static';
  }
}
