import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { PaymentRequestTips } from 'src/app/shared/models/payment-request';

@Component({
  selector: 'app-slide-recommend',
  templateUrl: './slide-recommend.component.html',
  styleUrls: ['./slide-recommend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideRecommendComponent implements OnInit {
  @Input() raterShareToken: string;
  @Input() tips: PaymentRequestTips;
  @Input() link: string;

  urlCopied: boolean;

  constructor(private clipboardService: ClipboardService) {}

  ngOnInit(): void {}

  copyLinkToClipboard() {
    this.urlCopied = true;
    this.clipboardService.copyFromContent(
      'https://getme.global' + '/profile/' + this.raterShareToken,
    );
  }
}
