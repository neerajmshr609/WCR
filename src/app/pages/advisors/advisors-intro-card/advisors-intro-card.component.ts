import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import Typewriter from 'typewriter-effect/dist/core';

@Component({
  selector: 'app-advisors-intro-card',
  templateUrl: './advisors-intro-card.component.html',
  styleUrls: ['./advisors-intro-card.component.scss'],
})
export class AdvisorsIntroCardComponent implements AfterViewInit {
  @ViewChild('cardRef') cardRef: ElementRef;

  constructor() {}

  ngAfterViewInit() {
    const typewriter = new Typewriter(this.cardRef.nativeElement, {
      delay: 45,
      cursor: '',
    });

    typewriter
      .pauseFor(1500)
      .typeString(
        '<br><span class="advisors-intro-card-slide advisors-intro-card-slide-1">Find fastly</span><br>',
      )
      .typeString(
        '<span class="advisors-intro-card-slide advisors-intro-card-slide-1">human</span><br>',
      )
      .typeString(
        '<span class="advisors-intro-card-slide advisors-intro-card-slide-1">advice</span><br>',
      )
      .typeString(
        '<span class="advisors-intro-card-slide advisors-intro-card-slide-1">around</span><br>',
      )
      .typeString(
        '<span class="advisors-intro-card-slide advisors-intro-card-slide-1">skills or</span><br>',
      )
      .changeDelay(70)
      .typeString(
        '<span class="advisors-intro-card-slide advisors-intro-card-slide-1">software</span><br>',
      )
      .pauseFor(800)
      .changeDelay(45)
      .typeString(
        '<br><span class="advisors-intro-card-subtext">you’re stuck with.</span>',
      )
      .pauseFor(1000)
      .deleteAll(8)
      .typeString(
        '<span class="advisors-intro-card-slide advisors-intro-card-slide-2">Select a skill.</span><br>',
      )
      .pauseFor(500)
      .typeString(
        '<span class="advisors-intro-card-slide advisors-intro-card-slide-2">Contact the</span><br>',
      )
      .typeString(
        '<span class="advisors-intro-card-slide advisors-intro-card-slide-2">advisor</span><br>',
      )
      .typeString(
        '<span class="advisors-intro-card-slide advisors-intro-card-slide-2">describing</span><br>',
      )
      .typeString(
        '<span class="advisors-intro-card-slide advisors-intro-card-slide-2">your problem.</span><br>',
      )
      .pauseFor(500)
      .typeString(
        '<span class="advisors-intro-card-slide advisors-intro-card-slide-2">Create a</span><br>',
      )
      .typeString(
        '<span class="advisors-intro-card-slide advisors-intro-card-slide-2">video call</span><br>',
      )
      .changeDelay(70)
      .typeString(
        '<span class="advisors-intro-card-slide advisors-intro-card-slide-2">including</span><br>',
      )
      .pauseFor(800)
      .changeDelay(45)
      .typeString(
        '<br><span class="advisors-intro-card-subtext">screensharing.</span>',
      )
      .start();

    this.onResize();
  }

  @HostListener('window:resize') onResize() {
    const card = this.cardRef.nativeElement as HTMLElement;
    const height = card.clientHeight;

    card.style.setProperty(
      '--advisors-intro-card-slide-1-font-size',
      height * 0.1106 + 'px',
    );
    card.style.setProperty(
      '--advisors-intro-card-slide-2-font-size',
      height * 0.08484 + 'px',
    );
    card.style.setProperty(
      '--advisors-intro-card-slide-3-font-size',
      height * 0.0606 + 'px',
    );
  }
}
