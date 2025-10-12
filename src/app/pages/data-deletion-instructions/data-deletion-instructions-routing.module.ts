// src/app/pages/data-deletion-instructions/data-deletion-instructions-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataDeletionInstructionsComponent } from './data-deletion-instructions.component';

const routes: Routes = [
  {
    path: '',
    component: DataDeletionInstructionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataDeletionInstructionsRoutingModule {}
