import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-iframely-embed',
  template: `<section class="embed-parent">
    <div style="width: 100%" bind-innerHTML="iframe | safe: 'html'"></div>
    <div style="padding: 10px" *ngIf="subtitle">{{ subtitle | translate }}</div>
  </section>`,
  styleUrls: ['./iframely-embed.component.scss'],
})
export class IframelyEmbedComponent implements OnChanges {
  @Input() iframe = '';
  @Input() subtitle: string;

  constructor() {
    // @ts-ignore
    iframely.load();
  }

  ngOnChanges() {
    // @ts-ignore
    iframely.load();
  }
}
