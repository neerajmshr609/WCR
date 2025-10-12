import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import Flickity from 'flickity/dist/flickity.pkgd.js';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { Project } from 'src/app/shared/models/project.model';
import { InsightsChannelEnum } from 'src/app/shared/enums';
import { InsightsService } from 'src/app/services/insights.service';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { map, takeUntil, tap } from 'rxjs/operators';
import { RatebackObject } from 'src/app/shared/models/rateback-object';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('presentationNavRef') presentationNavRef: ElementRef;

  @Input() public isUploadPlaceholder = false;
  @Input() public project: Project;

  @Output() public deleteUpdate = new EventEmitter<number>();

  public ratebacks: RatebackObject;
  public ratings: RatebackObject;

  public feedbacksCount = 0;
  public ratebacksCount = 0;
  public newFeedbackCount = 0;
  public oldFeedbackCount = 0;
  public hasReviews = false;

  public publicLink: string;

  public horizontalSlider: Flickity;
  public selectedFile: Projectfile;
  public copied: boolean;

  public isCompressing = false;
  public errorFiles: string[];

  public insightsChannels = InsightsChannelEnum;

  constructor(
    private cdRef: ChangeDetectorRef,
    private analyticsService: AnalyticsService,
    private insightsService: InsightsService,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    if (!this.project) {
      return;
    }

    const baseUrl = location.origin;
    this.publicLink = baseUrl + '/rateflow/' + this.project.sharetoken;

    const files = this.project.projectfiles;
    this.isCompressing = files.some(
      (file) => file.conversion.state && file.conversion.state !== 'COMPLETE',
    );
    this.errorFiles = files
      .filter((file) => file.conversion?.state?.toLowerCase() === 'error')
      .map((file) => file.name);
  }

  ngAfterViewInit(): void {
    if (this.isUploadPlaceholder) {
      return;
    }

    this.fetchRatings();
    this.fetchRatebacks();
    this.fetchFeedbacks();

    if (this.project.projectfiles.length > 1) {
      this.initSlider();
    }
  }

  initSlider() {
    this.horizontalSlider = new Flickity(
      this.presentationNavRef.nativeElement,
      {
        setGallerySize: false,
        contain: true,
        draggable: true,
        pageDots: false,
        prevNextButtons: true,
      },
    );

    const onSelect = function (event, pointer, cellElement, cellIndex) {
      this.didSelectObjectAtIndex(cellIndex);
    }.bind(this);

    this.horizontalSlider.on('staticClick', onSelect);
  }

  fetchFeedbacks() {
    this.insightsService
      .fetchFeedbacksForProject(this.project.id)
      .pipe(takeUntil(this.destroyed))
      .subscribe((feedbacks) => {
        this.ratings = {
          strengths: feedbacks.filter(
            (obj) => obj.feedbacktype === 'strengthsItems',
          ).length,
          weaknesses: feedbacks.filter(
            (obj) => obj.feedbacktype === 'weaknessesItems',
          ).length,
          nextsteps: feedbacks.filter(
            (obj) => obj.feedbacktype === 'nextstepsItems',
          ).length,
          links: feedbacks.filter((obj) => obj.feedbacktype === 'linksItems')
            .length,
        };

        this.feedbacksCount = Object.values(this.ratings).reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0,
        );
      });
  }

  fetchRatebacks() {
    this.insightsService
      .fetchRatebacksForProject(this.project.id)
      .pipe(takeUntil(this.destroyed))
      .subscribe((results) => {
        this.ratebacks = {
          discouraging: results.filter((rateback) => rateback.value === -5)
            .length,
          unhelpful: results.filter((rateback) => rateback.value === -1).length,
          helpful: results.filter((rateback) => rateback.value === 1).length,
          inspiring: results.filter((rateback) => rateback.value === 5).length,
        };

        this.ratebacksCount = Object.values(this.ratebacks).reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0,
        );
      });
  }

  fetchRatings() {
    this.insightsService
      .fetchRatingsForProject(this.project.id)
      .pipe(
        takeUntil(this.destroyed),
        map((res) => res.filter((rating) => rating.feedbacks.length)),
      )
      .subscribe((ratings) => {
        this.newFeedbackCount = Array.from(
          new Set(
            ratings
              .filter((rating) => rating.open_card_session)
              .map((rating) => rating.feedbacksession_id),
          ),
        ).length;
        this.oldFeedbackCount = ratings.filter(
          (rating) => !rating.open_card_session,
        ).length;

        this.hasReviews = ratings.length > 0;
        this.cdRef.detectChanges();
      });
  }

  copyToClipboard() {
    this.copied = true;
    this.analyticsService.trackEvent('Projects', 'copy-public-link');
  }

  didSelectDelete() {
    this.deleteUpdate.emit(this.project.id);
  }

  didSelectObjectAtIndex(index: number) {
    if (index === 0) {
      this.selectedFile = { total_score: this.project.project_score };
      return;
    }

    if (index === 1) {
      this.selectedFile = { total_score: this.project.total_score };
      return;
    }

    this.selectedFile = this.project.projectfiles[index - 2];
  }

  didSelectAllReviews() {
    this.router.navigate([this.project.id], {
      relativeTo: this.route,
      queryParams: {
        channel: InsightsChannelEnum.latest,
      },
    });
  }

  didSelectRatebackSessions() {
    this.router.navigate([this.project.id], {
      relativeTo: this.route,
      queryParams: {
        channel: InsightsChannelEnum.inbox,
      },
    });
  }

  didSelectRatingsType(type: number) {
    let channel;

    if (type === 1) {
      channel = InsightsChannelEnum.strengths;
    }

    if (type === 2) {
      channel = InsightsChannelEnum.weaknesses;
    }

    if (type === 3) {
      channel = InsightsChannelEnum.nextsteps;
    }

    if (type === 4) {
      channel = InsightsChannelEnum.links;
    }

    this.router.navigate([this.project.id], {
      relativeTo: this.route,
      queryParams: { channel },
    });
  }

  didSelectRateback(rateback: number) {
    let channel;

    if (rateback === -5) {
      channel = InsightsChannelEnum.discouraging;
    }

    if (rateback === -1) {
      channel = InsightsChannelEnum.unhelpful;
    }

    if (rateback === 1) {
      channel = InsightsChannelEnum.helpful;
    }

    if (rateback === 5) {
      channel = InsightsChannelEnum.inspiring;
    }

    this.router.navigate([this.project.id], {
      relativeTo: this.route,
      queryParams: { channel },
    });
  }

  colorNameForScore(score: number) {
    if (score < 10) {
      return 'gray';
    }
    if (score <= 30) {
      return 'red';
    }
    if (score <= 50) {
      return 'orange';
    }
    if (score > 50) {
      return 'green';
    }
  }

  public togglePublished() {
    this.projectService
      .updateProject({ ...this.project, published: !this.project.published })
      .pipe(
        takeUntil(this.destroyed),
        tap(() => (this.project.published = !this.project.published)),
      )
      .subscribe();
  }
}
