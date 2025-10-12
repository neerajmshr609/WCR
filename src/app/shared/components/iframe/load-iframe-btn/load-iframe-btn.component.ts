import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-load-iframe-btn',
  templateUrl: './load-iframe-btn.component.html',
  styleUrls: ['./load-iframe-btn.component.scss'],
})
export class LoadIframeBtnComponent implements OnInit {
  @Output() clicked = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
