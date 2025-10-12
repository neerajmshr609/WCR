import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagsOrderComponent } from './layout/tags-order.component';

import { TagsOrderRoutingModule } from './tags-order-routing.module';

@NgModule({
  declarations: [TagsOrderComponent],
  imports: [SharedModule, TagsOrderRoutingModule],
})
export class TagsOrderModule {}
