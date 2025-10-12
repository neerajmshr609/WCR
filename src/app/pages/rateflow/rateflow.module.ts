import { NgModule } from '@angular/core';
import { RateflowComponent } from './rateflow.component';

import { RouterModule } from '@angular/router';
import { RateflowRoutingModule } from './rateflow-routing.module';
import { FeedbackSharedModule } from 'src/app/shared/feedback-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonComponent } from '../../shared/UIkit/button/button.component';
import { IconSubmitComponent } from '../../shared/icons/icon-submit/icon-submit.component';
import { TranslateModule } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';

@NgModule({
  declarations: [RateflowComponent],
  imports: [
    SharedModule,
    FeedbackSharedModule,
    RouterModule,
    RateflowRoutingModule,
    ButtonComponent,
    IconSubmitComponent,
    TranslateModule.forChild(createForChildProviderConfig('rateflow')),
  ],
})
export class RateflowModule {}
