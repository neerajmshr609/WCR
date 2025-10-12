import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import Typewriter from 'typewriter-effect/dist/core';

@Component({
  selector: 'app-subtitle-card',
  templateUrl: './subtitle-card.component.html',
  styleUrls: ['./subtitle-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubtitleCardComponent implements AfterViewInit {
  @ViewChild('subtitle', { static: true }) subtitle: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    const typewriter = new Typewriter(this.subtitle.nativeElement, {
      delay: 40,
      cursor: '',
    });
    typewriter
      .pauseFor(1000)
      .typeString(
        'Win more prospects faster by adding value first using content, questions and feedback to get conversations started.',
      )
      .start();
  }
}
