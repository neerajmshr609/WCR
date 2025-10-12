import { NgModule } from '@angular/core';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { MatCommonModule } from '@angular/material/core';
import { NgxPayPalModule } from 'ngx-paypal';
import { AddFundsComponent } from './add-funds/add-funds.component';
import { MyAdvisersSelectComponent } from './my-advisers-select/my-advisers-select.component';
import { MySkillsSelectComponent } from './my-skills-select/my-skills-select.component';
import { NgArrayPipesModule } from 'ngx-pipes';
import { PresenterQuestionItemComponent } from './project-edit/presenter-question-item/presenter-question-item.component';
import { IframePreviewDialogComponent } from './iframe-preview-dialog/iframe-preview-dialog.component';
import { DragNDropGridComponent } from './drag-n-drop-grid/drag-n-drop-grid.component';
import { DragNDropGridItemComponent } from './drag-n-drop-grid/drag-n-drop-grid-item/drag-n-drop-grid-item.component';
import { UploadRoutingModule } from './upload-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentSliderModule } from 'src/app/shared/components/payment-slider/payment-slider.module';
import { SkillSelectModuleModule } from './my-skills-select/skill-select-module.module';
import { SortablejsModule } from 'ngx-sortablejs-v16';
import { provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
    ProjectEditComponent,
    AddFundsComponent,
    MyAdvisersSelectComponent,
    PresenterQuestionItemComponent,
    IframePreviewDialogComponent,
    DragNDropGridComponent,
    DragNDropGridItemComponent,
  ],
  imports: [
    SharedModule,
    UploadRoutingModule,
    MatCommonModule,
    NgxPayPalModule,
    SortablejsModule,
    NgArrayPipesModule,
    PaymentSliderModule,
    SkillSelectModuleModule,
  ],
  providers: [provideNgxMask()],
})
export class UploadModule {}
