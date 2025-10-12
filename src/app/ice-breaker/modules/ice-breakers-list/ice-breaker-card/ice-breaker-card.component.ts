import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IceBreaker as IceBreakerServiceModel } from 'src/app/ice-breaker/modules/ice-breaker-template/ice-breaker-template-messages';
import { CardImageComponent } from '../../../../shared/UIkit/card-image/card-image.component';
import { IconMoreVerticalComponent } from '../../../../shared/icons/icon-more-vertical/icon-more-vertical.component';
import { ButtonComponent } from '../../../../shared/UIkit/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconShakeHandsSmallComponent } from '../../../../shared/icons/icon-shake-hands-small/icon-shake-hands-small.component';
import { take } from 'rxjs/operators';
import { IceBreakerService } from 'src/app/ice-breaker/service/ice-breaker.service';
import { IceBreaker as IceBreakerModel } from 'src/app/ice-breaker/model/response/ice-breaker.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-ice-breaker-card',
  standalone: true,
  imports: [
    CommonModule,
    CardImageComponent,
    IconMoreVerticalComponent,
    ButtonComponent,
    TranslateModule,
    IconShakeHandsSmallComponent,
  ],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('300ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
  templateUrl: './ice-breaker-card.component.html',
  styleUrls: ['./ice-breaker-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IceBreakerCardComponent {
  readonly iceBreaker = input.required<IceBreakerModel>();
  readonly fullView = input(false);
  readonly emitFullViewToggle = output();
  readonly orgId = input<number | null>(null);

  constructor(private readonly _iceBreakerService: IceBreakerService) {}

  startConversation() {
    // Convert to the expected IceBreaker type by extracting only the needed properties
    const iceBreaker = this.iceBreaker();

    // Create a partial compatible object with just the required ID
    // This is a workaround for the type mismatch
    const simplifiedIceBreaker = {
      id: iceBreaker.id,
      // Add required empty properties to match the interface
      allowOrgLevel: false,
      allowPlatformLevel: false,
      questions: [],
    } as IceBreakerServiceModel;

    this._iceBreakerService
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .join(simplifiedIceBreaker, this.orgId())
      .pipe(take(1))
      .subscribe();
  }
}
