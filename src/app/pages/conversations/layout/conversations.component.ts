import {
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import {
  Conversation,
  ConversationStateType,
  ConversationType,
} from 'src/app/shared/models/conversation.model';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { User } from 'src/app/shared/models/user.model';
import { ConversationsService } from '../services/conversations.service';
import { max, parseISO } from 'date-fns';
import { FooterService } from '../../../services/footer/footer.service';

interface MenuItem {
  name: string;
  param: string;
  disabled: boolean;
  badge: number;
  type: 'advisor' | 'student';
  userType: string;
  text: string;
  title: string;
  linkText: string;
  linkIcon: string;
  path: string;
}

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss'],
})
export class ConversationsComponent extends BaseComponent implements OnInit {
  @ViewChild('activityContainerRef') activityContainerRef: ElementRef;
  @ViewChild('emptyRef') emptyRef: ElementRef;

  conversations$ = new BehaviorSubject<Conversation[]>(null);

  public selectedFilterList = signal<
    (ConversationType | ConversationStateType)[]
  >([]);

  public filterState: WritableSignal<{ search?: string; types?: any[] }> =
    signal({});

  selectedId: number = null; // should be null because undefined means we selected scheduled calls filter

  public isLoading;
  private page = 1;

  private canLoadConversations = true;
  private canLoadFeedbackActivity = true;

  public currentUser: User;

  constructor(
    private authService: AuthService,
    private conversationsService: ConversationsService,
    private readonly _footerService: FooterService,
  ) {
    super();
  }

  loadMore(): void {
    if (this.canLoadConversations) {
      this.fetchConversations(this.filterState());
    }
  }

  private getMaxDate(dates: string[]) {
    return max(dates.filter((d) => d).map((d) => parseISO(d))).valueOf();
  }

  private sortingTime(a, b): number {
    let dateA = null;
    if ('project' in a) {
      const lessonsDatesA =
        a.lessons?.flatMap((l) => [l.created_at, l.start, l.end]) || [];
      const sessionsDatesA =
        a.message_payment_sessions?.flatMap((s) => [
          s.created_at,
          s.last_message_time,
        ]) || [];
      dateA = this.getMaxDate([
        a.last_message_time,
        a.created_at,
        ...lessonsDatesA,
        ...sessionsDatesA,
      ]);
    } else {
      dateA = new Date(a.rating_created).valueOf();
    }

    let dateB = null;
    if ('project' in b) {
      const lessonsDatesB =
        b.lessons?.flatMap((l) => [l.created_at, l.start, l.end]) || [];
      const sessionsDatesB =
        b.message_payment_sessions?.flatMap((s) => [
          s.created_at,
          s.last_message_time,
        ]) || [];
      dateB = this.getMaxDate([
        b.last_message_time,
        b.created_at,
        ...lessonsDatesB,
        ...sessionsDatesB,
      ]);
    } else {
      dateB = new Date(b.rating_created).valueOf();
    }

    if (dateA < dateB) {
      return 1;
    }

    if (dateA === dateB) {
      return 0;
    }

    if (dateA > dateB) {
      return -1;
    }
  }

  private fetchConversations(filters?: any, loadMore = true): void {
    if (!this.canLoadConversations && loadMore) {
      return;
    }
    this.isLoading = true;
    const allItems = this.conversations$.value || [];
    this.conversationsService
      .fetchConversations(this.page, this.selectedId, filters)
      .pipe(
        tap((res) => {
          this.canLoadConversations = res.total_count > this.page * 10;
          if (loadMore) {
            this.page++;
            allItems.sort(this.sortingTime.bind(this));
            allItems.push(...res.data);
            this.conversations$.next(allItems);
          } else {
            this.conversations$.next(res.data);
          }
        }),
        catchError((err) => throwError(err)),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe();
  }

  public getConversationPartnerId(
    conversation: Conversation,
  ): number | undefined {
    let conversationPartnerId: number | undefined;
    if (conversation.members?.length < 3) {
      conversation.members.forEach((member) => {
        if (member.user_id !== this.currentUser.id) {
          conversationPartnerId = member.user_id;
        }
      });
    }

    return conversationPartnerId;
  }

  ngOnInit(): void {
    this._footerService.hideFooter();
    this.fetchConversations();
    this.authService.userSubject$
      .pipe(
        filter((res) => !!res),
        take(1),
        tap((user: User) => (this.currentUser = user)),
        switchMap(() =>
          this.conversationsService.fetchFunnelsForUser(this.currentUser.id),
        ),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._footerService.displayFooter();
  }

  public handleFilterChange(filters: any) {
    this.page = 1;
    const updatedFilters = this.updateFilters(filters);

    if (!filters.types && !filters.search) {
      this.filterState.set(filters);
    } else {
      this.filterState.set(updatedFilters);
    }
    this.fetchConversations(this.filterState(), false);
  }

  private updateFilters(filters) {
    const currentFilters = this.filterState();
    if (filters.search || filters.search === '') {
      currentFilters.search = filters.search;
    }

    if (filters.types) {
      currentFilters.types = filters.types;
    }
    return currentFilters;
  }

  public addNewConversation(conversation: Conversation) {
    const currentConversations = this.conversations$.value || [];
    currentConversations.unshift(conversation);
    this.conversations$.next(currentConversations);
  }

  public handleSelectedEntities(
    $event: (ConversationType | ConversationStateType)[],
  ) {
    this.selectedFilterList.set($event);
  }
}
