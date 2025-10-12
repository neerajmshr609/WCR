import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Projectfile } from 'src/app/shared/models/projectfile.model';

@Component({
  selector: 'app-pdf-presentation',
  templateUrl: './pdf-presentation.component.html',
  styleUrls: ['./pdf-presentation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PdfPresentationComponent implements OnInit {
  @Input() public file: Projectfile;

  public loaded: boolean;

  constructor() {}

  ngOnInit(): void {}

  load() {
    this.loaded = true;
  }
}
