import {
  ChangeDetectionStrategy,
  Component,
  effect,
  OnInit,
  signal,
  ViewChild,
  ViewChildren,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { OpenRequestsService } from '../../service/open-requests.service';
import { MENU_ITEMS_MOCK } from '../../MOCK';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkillsService } from '../../../../services/skill/skills.service';
import { ArtcategoriesService } from '../../../../services/artcategory/artcategories.service';
import { Skill } from '../../../../services/skill/model/skill.model';
import { areLoading } from '../../../../shared/lib/api-interaction.helpers';
import { IGetAvailableOpenRequestsParams } from '../../model/request/get-available-open-requests-params.interface';
import { OpenRequestCardComponent } from '../open-request-card/open-request-card.component';
import { TypingCardConfig } from '../../../../shared/components/typing-card/typing-card.component';

@Component({
  selector: 'app-open-requests',
  templateUrl: './open-requests.component.html',
  styleUrl: './open-requests.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenRequestsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardsContainer') cardsContainer!: ElementRef<HTMLElement>;
  @ViewChildren(OpenRequestCardComponent)
  cardComponents!: QueryList<OpenRequestCardComponent>;
  public readonly typingCardConfig: TypingCardConfig = {
    bgColor: '#33364D',
    fontSizes: {
      en: [40, 48],
      de: [38, 42],
      ru: [34, 40],
      uk: [34, 40],
    },
    repeat: true,
    textColor: '#FFF894',
    textColorSecond: '#FFFFFF',
  };

  readonly menuItems = MENU_ITEMS_MOCK;
  readonly selectedMenuItem = signal<(typeof MENU_ITEMS_MOCK)[number] | null>(
    null,
  );
  readonly skills = toSignal(this._skillsService.skills$);
  readonly artCategories = toSignal(this._artCategoriesService.artCategories$);
  readonly isLoading = toSignal(
    areLoading(
      this._artCategoriesService.isLoading$,
      this._skillsService.isLoading$,
      this._openRequestsService.isLoading$,
    ),
  );
  readonly selectedSkills = signal<Skill[]>([]);
  readonly openRequests = toSignal(this._openRequestsService.openRequests$);
  readonly hasMorePages = toSignal(this._openRequestsService.hasMorePages$);
  private intersectionObserver: IntersectionObserver | null = null;
  private lastObservedCard: Element | null = null;

  constructor(
    private readonly _openRequestsService: OpenRequestsService,
    private readonly _skillsService: SkillsService,
    private readonly _artCategoriesService: ArtcategoriesService,
  ) {
    effect(
      () => {
        const selectedSkills = this.selectedSkills();
        const selectedMenuItem = this.selectedMenuItem();
        const params: IGetAvailableOpenRequestsParams = {
          review_queue: selectedMenuItem?.param === 'review_queue',
          filter: [...selectedSkills],
        };
        this._openRequestsService.fetchOpenRequests(params);
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this._artCategoriesService.fetchArtcategories({ bound_to_skill: true });
    this._skillsService.fetchSkills();
  }

  ngAfterViewInit(): void {
    this.setupInfiniteScroll();

    // Subscribe to changes in the card components
    this.cardComponents.changes.subscribe(() => {
      this.updateIntersectionObserver();
    });
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupInfiniteScroll(): void {
    const options = {
      root: null, // Use the viewport as root
      rootMargin: '100px',
      threshold: 0.1,
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isLoading() && this.hasMorePages()) {
          const selectedSkills = this.selectedSkills();
          const selectedMenuItem = this.selectedMenuItem();
          const params: IGetAvailableOpenRequestsParams = {
            review_queue: selectedMenuItem?.param === 'review_queue',
            filter: [...selectedSkills],
          };
          this._openRequestsService.loadNextPage(params);
        }
      });
    }, options);

    // Initial setup
    this.updateIntersectionObserver();
  }

  private updateIntersectionObserver(): void {
    if (!this.intersectionObserver || !this.cardComponents) {
      return;
    }

    // Disconnect from previous observation
    if (this.lastObservedCard) {
      this.intersectionObserver.unobserve(this.lastObservedCard);
      this.lastObservedCard = null;
    }

    const cardElements = this.cardComponents.toArray();

    if (cardElements.length > 0) {
      // Get the last card's element
      const lastCard =
        cardElements[cardElements.length - 1].elementRef.nativeElement;
      this.lastObservedCard = lastCard;
      this.intersectionObserver.observe(lastCard);
    }
  }
}
