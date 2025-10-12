import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-satisfied-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './satisfied-icon.component.html',
  styleUrl: './satisfied-icon.component.scss',
  imports: [NgClass],
})
export class SatisfiedIconComponent extends BaseIconDirective {
  public active = input<boolean>(false);
}
