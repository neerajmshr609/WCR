import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
} from '@angular/core';
import { smoothHeight } from '../../animations';

@Component({
  selector: 'app-cookie-notification',
  templateUrl: './cookie-notification.component.html',
  styleUrls: ['./cookie-notification.component.scss'],
  animations: [smoothHeight],
})
export class CookieNotificationComponent implements OnInit, OnChanges {
  @Output() hideNotification = new EventEmitter();
  @Output() agree = new EventEmitter();

  showMore: boolean;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes): void {}
}
