import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss'],
})
export class StripeComponent implements OnInit {
  errorString: string;

  constructor(
    private transactionsService: TransactionsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const params = this.route.snapshot.queryParams;

    if (params.code) {
      this.transactionsService.createStripePayoutsUser(params.code).subscribe(
        () => {
          this.router.navigate(['/settings'], {
            queryParams: {
              stripeConnected: true,
            },
            replaceUrl: true,
          });
        },
        (error) => {
          this.errorString = error.error.error;
        },
      );
    }
  }
}
