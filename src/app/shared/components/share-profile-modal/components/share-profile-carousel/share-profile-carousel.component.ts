import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../base.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-share-profile-carousel',
  templateUrl: './share-profile-carousel.component.html',
  styleUrls: ['./share-profile-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareProfileCarouselComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  @Input() shareLink = '';

  isMobile = false;
  shareSocialButtonsIcons = [
    {
      name: 'facebook',
      icon: '/assets/weblinks/facebook.svg',
    },
    {
      name: 'linkedin',
      icon: '/assets/weblinks/linkedin.svg',
    },
    {
      name: 'twitter',
      icon: '/assets/weblinks/twitter.svg',
    },
    {
      name: 'telegram',
      icon: '/assets/weblinks/telegram.svg',
    },
    {
      name: 'whatsapp',
      icon: '/assets/weblinks/whatsapp.svg',
    },
    {
      name: 'xing',
      icon: '/assets/weblinks/xing.svg',
    },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(max-width: 877px)')
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => (this.isMobile = res.matches));
  }

  copyLink(): void {
    this.clipboard.copy(this.shareLink);
    this.snackBar.open('copied to clipboard', '', {
      duration: 4000,
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
