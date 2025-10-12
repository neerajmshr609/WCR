import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-blog-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-icon.component.html',
  styleUrls: ['../icon.base.component.scss'],
})
export class BlogIconComponent extends BaseIconDirective {}
