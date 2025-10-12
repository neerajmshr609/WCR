import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-stop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-stop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./icon-stop.component.scss'],
})
export class IconStopComponent extends BaseIconDirective {}
