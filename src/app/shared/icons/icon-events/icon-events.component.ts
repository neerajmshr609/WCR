import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-events.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./icon-events.component.scss'],
})
export class IconEventsComponent extends BaseIconDirective {}
