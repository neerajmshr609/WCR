import { NgModule } from '@angular/core';
import { MyProjectsRoutingModule } from './my-projects-routing.module';
import { IntroCardComponent } from './intro-card/intro-card.component';
import { MyProjectsComponent } from './my-projects.component';
import { PqaCardComponent } from './pqa-card/pqa-card.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ProjectShareDialogComponent } from './project-share-dialog/project-share-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainContentMenuModule } from '../../main-content-menu/main-content-menu.module';
import { TranslateModule } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';

@NgModule({
  declarations: [
    MyProjectsComponent,
    ProjectCardComponent,
    ProjectShareDialogComponent,
    PqaCardComponent,
    IntroCardComponent,
  ],
  imports: [
    SharedModule,
    MyProjectsRoutingModule,
    MainContentMenuModule,
    TranslateModule.forChild(createForChildProviderConfig('my-projects')),
  ],
})
export class MyProjectsModule {}
