import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-topics-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './topics-icon.component.html',
  styleUrls: ['./topics-icon.component.scss'],
})
export class TopicsIconComponent extends BaseIconDirective {}
