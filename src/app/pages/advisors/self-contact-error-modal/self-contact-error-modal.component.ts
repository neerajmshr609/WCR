import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-self-contact-error-modal',
  templateUrl: './self-contact-error-modal.component.html',
  styleUrls: ['./self-contact-error-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelfContactErrorModalComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
