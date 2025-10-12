import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import Typewriter from 'typewriter-effect/dist/core';

@Component({
  selector: 'app-intro-card',
  templateUrl: './intro-card.component.html',
  styleUrls: ['./intro-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroCardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const app = document.getElementById('intro-card');
    const typewriter = new Typewriter(app, {
      delay: 45,
      cursor: '',
    });
    typewriter
      .pauseFor(1000)
      .typeString('<span class="intro-card-slide">This is</span><br>')
      .typeString('<span class="intro-card-slide">the area</span><br>')
      .typeString('<span class="intro-card-slide">where you</span><br>')
      .typeString('<span class="intro-card-slide">can find</span><br>')
      .typeString('<span class="intro-card-slide">all your</span><br>')
      .typeString('<span class="intro-card-slide">uploaded</span><br>')
      .changeDelay(70)
      .typeString('<span class="intro-card-slide">projects</span><br>')
      .pauseFor(800)
      .changeDelay(45)
      .typeString('<br><span class="intro-card-subtext">reviews.</span>')
      .pauseFor(1500)
      .deleteAll(8)
      .typeString('<span class="intro-card-slide">Once an</span><br>')
      .typeString('<span class="intro-card-slide">advisor</span><br>')
      .typeString('<span class="intro-card-slide">left a</span><br>')
      .typeString('<span class="intro-card-slide">review we</span><br>')
      .typeString('<span class="intro-card-slide">ask you to</span><br>')
      .typeString('<span class="intro-card-slide">evaluate</span><br>')
      .changeDelay(70)
      .typeString('<span class="intro-card-slide">each given</span><br>')
      .pauseFor(800)
      .changeDelay(45)
      .typeString('<br><span class="intro-card-subtext">comment.</span>')
      .start();
  }
}
