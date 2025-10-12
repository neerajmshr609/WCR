import { AfterViewInit, Component, OnInit } from '@angular/core';
declare const initAnimation: any;

@Component({
  selector: 'app-signup-animation',
  templateUrl: './signup-animation.component.html',
  styleUrls: ['./signup-animation.component.scss'],
})
export class SignupAnimationComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    initAnimation();
  }
}
