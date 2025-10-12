import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AboutCard } from 'src/app/shared/models/about-cards.model';

@Component({
  selector: 'app-about-card',
  templateUrl: './about-card.component.html',
  styleUrls: ['./about-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutCardComponent {
  @Input() card: AboutCard;
  @Input() index: number;
}
