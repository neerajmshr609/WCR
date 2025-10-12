import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditIceBreakerModalComponent } from './edit-ice-breaker-modal/edit-ice-breaker-modal.component';
import { ConversationMessageModule } from '../converstation-message/conversation-message.module';
import { IceBreakerTemplateModule } from '../../ice-breaker-template.module';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { PriceSliderModule } from 'src/app/pages/conversation/price-slider/price-slider.module';
import { ShareProfileCarouselModule } from 'src/app/shared/components/share-profile-modal/components/share-profile-carousel/share-profile-carousel.module';
import { ScrollBtnModule } from 'src/app/shared/components/scroll-btn/scroll-btn.module';

@NgModule({
  declarations: [EditIceBreakerModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    ConversationMessageModule,
    IceBreakerTemplateModule,
    SharedModule,
    PriceSliderModule,
    ShareProfileCarouselModule,
    ScrollBtnModule,
  ],
})
export class EditIceBreakerModule {}
