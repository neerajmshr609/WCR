import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-load-pdf-btn',
  templateUrl: './load-pdf-btn.component.html',
  styleUrls: ['./load-pdf-btn.component.scss'],
})
export class LoadPdfBtnComponent implements OnInit {
  @Output() clicked = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
