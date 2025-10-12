import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-first-card',
  templateUrl: './first-card.component.html',
  styleUrls: ['./first-card.component.scss'],
})
export class FirstCardComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() form: UntypedFormGroup;
  @Input() error: string;

  @Output() signup = new EventEmitter<boolean>();

  public revealIdentity: boolean;

  constructor() {}

  ngOnInit(): void {}
}
