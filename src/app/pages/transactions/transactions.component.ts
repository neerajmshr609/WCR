import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItemObject } from 'src/app/shared/models/common-interface';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  menuItems: MenuItemObject[];

  constructor(
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.menuItems = [
      {
        title: 'Transactions',
        object: 'history',
      },
      {
        title: 'Free tier',
        object: 'cap',
      },
      {
        title: 'Invoices',
        object: 'invoices',
      },
      {
        title: 'Ideas',
        object: 'ideas',
      },
    ];

    this.titleService.setTitle('Wallet');
    this.onMenuItemSelect('history');
  }

  onMenuItemSelect(routerLink: string) {
    this.router.navigate([routerLink], { relativeTo: this.route });
  }
}
