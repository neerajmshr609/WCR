import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IShareIceBreakerModal } from './share-ice-breaker-modal.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareModalComponent } from '@ui-components/modals/share-modal/share-modal.component';
import { IconRenderComponent } from '@icons/_base/icon-render/icon-render.component';
import { HorizontalLineComponent } from '@ui-kit/horizontal-line/horizontal-line.component';

@Component({
  selector: 'app-share-ice-breaker-modal',
  standalone: true,
  imports: [
    CommonModule,
    ShareModalComponent,
    IconRenderComponent,
    HorizontalLineComponent,
  ],
  templateUrl: './share-ice-breaker-modal.component.html',
  styleUrls: ['./share-ice-breaker-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareIceBreakerModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: IShareIceBreakerModal,
  ) {}

  readonly iceBreakerUrl = this._data.iceBreakerUrl;
  readonly titleText = this._data.titleText;
  readonly skillIcon = this._data.skillIcon;
  readonly skillName = this._data.skillName;
}
