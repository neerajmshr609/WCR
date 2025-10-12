import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-heart',
  templateUrl: './heart.component.html',
  styleUrls: ['./heart.component.scss'],
})
export class HeartComponent implements OnInit {
  @Input() text = 'thanks a lot';

  constructor() {}

  ngOnInit(): void {}
}
