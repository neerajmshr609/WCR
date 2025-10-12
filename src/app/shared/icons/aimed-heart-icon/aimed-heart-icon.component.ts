import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AimIconComponent } from '../aim-icon/aim-icon.component';
import { HeartIconComponent } from '../heart-icon/heart-icon.component';

@Component({
  selector: 'app-aimed-heart-icon',
  standalone: true,
  imports: [CommonModule, AimIconComponent, HeartIconComponent],
  templateUrl: './aimed-heart-icon.component.html',
  styleUrls: ['./aimed-heart-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AimedHeartIconComponent {
  readonly aimColor = input('#FFFFFF');
  readonly heartColor = input('#000FFF');
}
