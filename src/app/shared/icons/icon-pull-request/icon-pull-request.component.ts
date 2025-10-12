import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-pull-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-pull-request.component.html',
  styleUrls: ['./icon-pull-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPullRequestComponent extends BaseIconDirective {}
