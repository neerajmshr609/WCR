import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  constructor() {}

  ngOnInit() {}

  onClose() {
    this.close.emit();
  }
}
