import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TagsOrderComponent } from './layout/tags-order.component';

const routes: Routes = [{ path: '', component: TagsOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagsOrderRoutingModule {}
