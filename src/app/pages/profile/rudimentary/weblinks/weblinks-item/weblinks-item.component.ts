import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { UserWeblink } from 'src/app/shared/models/user-weblink.model';

@Component({
  selector: 'app-weblinks-item',
  templateUrl: './weblinks-item.component.html',
  styleUrls: ['./weblinks-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeblinksItemComponent implements OnInit {
  @Input() webLink: UserWeblink;
  @Input() isAuthUser: boolean;
  constructor() {}

  ngOnInit(): void {}

  navigateToSocialLink(link: string): void {
    if (link?.length) {
      window.open(link, '_blank');
    }
  }

  changeState() {
    //  this.webLink.active = !this.webLink.active;
  }
}
