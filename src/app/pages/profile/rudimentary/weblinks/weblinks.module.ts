import { NgModule } from '@angular/core';
import { WeblinksRoutingModule } from './weblinks-routing.module';
import { WeblinksComponent } from './layout/weblinks.component';
import { WeblinksItemComponent } from './weblinks-item/weblinks-item.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WeblinksServicesModule } from './services/weblinks-services.module';

@NgModule({
  declarations: [WeblinksComponent, WeblinksItemComponent],
  imports: [WeblinksRoutingModule, SharedModule, WeblinksServicesModule],
})
export class WeblinksModule {}
