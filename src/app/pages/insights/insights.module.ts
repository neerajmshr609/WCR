import { NgModule } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { NgArrayPipesModule } from 'ngx-pipes';
import { InsightsRoutingModule } from './insights-routing.module';

import { InsightsComponent } from './insights.component';
import { RatebackSummaryCardComponent } from './rateback-summary-card/rateback-summary-card.component';
import { InsightsNewsfeedComponent } from './insights-newsfeed/insights-newsfeed.component';
import { SlideConnectedComponent } from './rateback-summary-card/slide-connected/slide-connected.component';
import { SlideRecommendComponent } from './rateback-summary-card/slide-recommend/slide-recommend.component';
import { TrustedAdvisorPaymentComponent } from './trusted-advisor-payment/trusted-advisor-payment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentSliderModule } from 'src/app/shared/components/payment-slider/payment-slider.module';
import { TipsModule } from 'src/app/shared/components/tips/tips.module';
import { ReceiptModule } from 'src/app/shared/components/receipt/receipt.module';
import { MainContentMenuModule } from '../../main-content-menu/main-content-menu.module';

@NgModule({
  declarations: [
    InsightsComponent,
    TrustedAdvisorPaymentComponent,
    InsightsNewsfeedComponent,
    RatebackSummaryCardComponent,
    SlideConnectedComponent,
    SlideRecommendComponent,
  ],
  imports: [
    SharedModule,
    InsightsRoutingModule,
    MomentModule,
    NgArrayPipesModule,
    PaymentSliderModule,
    TipsModule,
    ReceiptModule,
    MainContentMenuModule,
  ],
})
export class InsightsModule {}
