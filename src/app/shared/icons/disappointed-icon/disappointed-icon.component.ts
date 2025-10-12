import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-disappointed-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disappointed-icon.component.html',
  styleUrl: './disappointed-icon.component.scss',
  imports: [NgClass],
})
export class DisappointedIconComponent extends BaseIconDirective {
  public active = input<boolean>(false);
}
