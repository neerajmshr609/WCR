import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '@icons/base-icon.directive';

@Component({
  selector: 'app-icon-visible',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-visible.component.html',
  styleUrls: ['./icon-visible.component.scss'],
})
export class IconVisibleComponent extends BaseIconDirective {}
