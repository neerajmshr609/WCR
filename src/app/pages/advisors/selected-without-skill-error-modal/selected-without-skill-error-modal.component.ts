import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './selected-without-skill-error-modal.component.html',
  styleUrls: ['./selected-without-skill-error-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedWithoutSkillErrorModalComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
