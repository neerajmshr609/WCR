import { Component, OnInit } from '@angular/core';
import Typewriter from 'typewriter-effect/dist/core';

@Component({
  selector: 'app-welcome-card',
  templateUrl: './welcome-card.component.html',
  styleUrls: ['./welcome-card.component.scss'],
})
export class WelcomeCardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // animation card
    const app = document.getElementById('welcome-card');
    const typewriter = new Typewriter(app, {
      delay: 45,
      cursor: '',
    });

    typewriter
      .pauseFor(1500)
      .typeString('<span class="welcome-card-slide-1">Discover</span><br>')
      .typeString('<span class="welcome-card-slide-1">interesting</span><br>')
      .typeString('<span class="welcome-card-slide-1">projects</span><br>')
      .typeString('<span class="welcome-card-slide-1">uploaded</span><br>')
      .typeString('<span class="welcome-card-slide-1">from our</span><br>')
      .typeString('<span class="welcome-card-slide-1">community</span><br>')
      .changeDelay(70)
      .typeString('<span class="welcome-card-slide-1">including</span><br>')
      .pauseFor(800)
      .changeDelay(45)
      .typeString('<br><span class="subtext">the feedback.</span>')
      .pauseFor(1500)
      .deleteAll(8)
      .typeString('<span class="welcome-card-slide-2">Interact with</span><br>')
      .typeString('<span class="welcome-card-slide-2">the works</span><br>')
      .typeString('<span class="welcome-card-slide-2">so we know</span><br>')
      .typeString('<span class="welcome-card-slide-2">faster whom</span><br>')
      .typeString('<span class="welcome-card-slide-2">you could</span><br>')
      .typeString('<span class="welcome-card-slide-2">inspire</span><br>')
      .typeString('<span class="welcome-card-slide-2">and</span><br>')
      .changeDelay(70)
      .typeString('<span class="welcome-card-slide-2">who could</span><br>')
      .pauseFor(800)
      .changeDelay(45)
      .typeString('<br><span class="subtext">inspire you.</span>')
      .start();
  }
}
