import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss'],
})
export class ComingSoonComponent implements OnInit {
  @Input() url: string;
  @Input() text: string;
  @Input() color: string;

  constructor() {}

  ngOnInit(): void {}
}
