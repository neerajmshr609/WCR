import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import { TransactionsCapComponent } from './transactions-cap/transactions-cap.component';
import { TransactionsInvoicesComponent } from './transactions-invoices/transactions-invoices.component';
import { TransactionsIdeasComponent } from './transactions-ideas/transactions-ideas.component';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: TransactionsComponent,
    children: [
      {
        path: 'history',
        component: TransactionsHistoryComponent,
      },
      {
        path: 'cap',
        component: TransactionsCapComponent,
      },
      {
        path: 'invoices',
        component: TransactionsInvoicesComponent,
      },
      {
        path: 'ideas',
        component: TransactionsIdeasComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
