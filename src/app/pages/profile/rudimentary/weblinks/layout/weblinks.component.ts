import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { WeblinksService } from '../services/weblinks.service';
import { UserWeblink } from 'src/app/shared/models/user-weblink.model';
import { BaseComponent } from 'src/app/shared/components/base.component';
import {
  filter,
  finalize,
  map,
  mergeMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-weblinks',
  templateUrl: './weblinks.component.html',
  styleUrls: ['./weblinks.component.scss'],
})
export class WeblinksComponent extends BaseComponent implements OnInit {
  isAuthUser = false;
  webLinks: UserWeblink[];
  userId: number;

  isSaving: boolean;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private weblinkservice: WeblinksService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetchWebLinks();
  }

  private fetchWebLinks(): void {
    this.authService.userSubject$
      .pipe(
        filter((res) => !!res || !this.authService.userIsSignedIn()),
        mergeMap((res: User) => {
          if (
            res?.sharetoken ===
            this.route.parent.parent.snapshot.params.profileToken
          ) {
            this.isAuthUser = true;
            this.userId = res.id;
            return this.weblinkservice.fetchWebLinks().pipe(
              map((weblinks) =>
                weblinks.map((link) => {
                  const userlink = res.user_weblinks.find(
                    (l) => l.weblink_id === link.id,
                  );

                  const { id, ...linkWithoutId } = link;
                  const mergedLink = { ...linkWithoutId, ...userlink };
                  mergedLink.weblink_id = link.id;

                  return mergedLink;
                }),
              ),
            );
          }

          this.isAuthUser = false;
          return this.authService.userProfileInfo$.pipe(
            map((res) => res.user_weblinks),
          );
        }),
        takeUntil(this.destroyed),
      )
      .subscribe((res) => (this.webLinks = res));
  }

  save() {
    this.isSaving = true;

    this.weblinkservice
      .saveWebLinks(this.webLinks, this.userId)
      .pipe(
        takeUntil(this.destroyed),
        finalize(() => (this.isSaving = false)),
      )
      .subscribe(() => this.snackBar.open('Saved!', null, { duration: 1000 }));
  }
}
