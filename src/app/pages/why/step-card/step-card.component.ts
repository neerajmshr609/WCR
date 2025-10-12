import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step-card',
  templateUrl: './step-card.component.html',
  styleUrls: ['./step-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepCardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
