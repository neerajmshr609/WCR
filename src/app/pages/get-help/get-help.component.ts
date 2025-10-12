import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SkillsService } from '../../services/skill/skills.service';
import { ArtcategoriesService } from '../../services/artcategory/artcategories.service';
import { Skill } from '../../services/skill/model/skill.model';
import { isArrayAndHasItems } from '../../shared/lib/array-helpers.lib';
import { IceBreakerService } from '../../ice-breaker/service/ice-breaker.service';
import { areLoading } from '../../shared/lib/api-interaction.helpers';
import { ResizeService } from '../../services/resize.service';
import {
  bounceInUpOnEnterAnimation,
  bounceOutDownOnLeaveAnimation,
  fadeInUpOnEnterAnimation,
} from 'angular-animations';
import { TranslateService } from '@ngx-translate/core';
import { IFilterPanelOutput } from '@ui-components/filter-panel/filter-pannel.interface';
import { ArtCategory } from '../../services/artcategory/model/artcategory.model';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { IceBreaker } from 'src/app/ice-breaker/model/response/ice-breaker.model';

@Component({
  selector: 'app-get-help',
  templateUrl: './get-help.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./get-help.component.scss'],
  animations: [
    fadeInUpOnEnterAnimation({ delay: 1400 }),
    bounceInUpOnEnterAnimation({ delay: 700 }),
    bounceOutDownOnLeaveAnimation(),
    trigger('collapseFade', [
      state(
        'open',
        style({
          height: '*',
          opacity: 1,
          overflow: 'hidden',
        }),
      ),
      state(
        'closed',
        style({
          height: '0px',
          opacity: 0,
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        }),
      ),
      transition('open => closed', [animate('300ms ease-in-out')]),
      transition('closed => open', [animate('300ms ease-in-out')]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetHelpComponent implements OnInit {
  readonly loadedSkills = toSignal(this._skillsService.skills$);
  readonly artCategories = toSignal(this._artCategoriesService.artCategories$);
  private readonly _loadedIceBreakers = toSignal(
    this._iceBreakerService.iceBreakers$,
  );
  readonly selectedSkills = signal<Skill[]>([]);
  public activeStep = signal<number>(0);
  private destroyRef = inject(DestroyRef);
  public textFilter = signal<string>(null);
  public focused = signal(false);
  public stepErrors = signal<{ [key: number]: boolean }>({});
  readonly step0HasError = computed(() => !!this.stepErrors()[0]);
  readonly step1HasError = computed(() => !!this.stepErrors()[1]);
  readonly step2HasError = computed(() => !!this.stepErrors()[2]);

  readonly iceBreakers = computed(() => {
    const selectedSkills = this.selectedSkills();
    const skillsAreSelected = isArrayAndHasItems(selectedSkills);
    const textFilter = (this.textFilter() ?? '').trim().toLowerCase();

    if (!textFilter && !skillsAreSelected) return [];
    let iceBreakers = this._loadedIceBreakers();

    if (textFilter) {
      iceBreakers = iceBreakers.filter((item) => {
        const allSkills = [...item.skills].flatMap((s) => [
          s.shortname,
          s.name,
        ]);
        const skillMatch = allSkills.some((skill) =>
          skill.toLowerCase().includes(textFilter),
        );

        const titleMatch = item.title.toLowerCase().includes(textFilter);
        return titleMatch || skillMatch;
      });
    }

    if (skillsAreSelected) {
      iceBreakers = iceBreakers.filter((_) => _.belongsTo(selectedSkills));
    }

    return iceBreakers;
  });

  readonly isLoading = toSignal(
    areLoading(
      this._artCategoriesService.isLoading$,
      this._skillsService.isLoading$,
      this._iceBreakerService.isLoading$,
    ),
  );
  readonly isNotDesktop = toSignal(this._resizeService.isNotDesktopScreen$);
  readonly skillsAreSelected = computed(() => !!this.selectedSkills().length);

  constructor(
    private readonly _skillsService: SkillsService,
    private readonly _artCategoriesService: ArtcategoriesService,
    private readonly _iceBreakerService: IceBreakerService,
    private readonly _resizeService: ResizeService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lang) => {
        this.fetchData();
      });
  }

  private fetchData(): void {
    this._artCategoriesService.fetchArtcategories({ bound_to_skill: true });
    this._skillsService.fetchSkills();
    this._iceBreakerService.fetchAllIceBreakers();
  }

  filtersChanged($event: IFilterPanelOutput<ArtCategory>) {
    if ($event) {
      this.textFilter.set($event.textFilter);
    }
  }

  get activeStepValue() {
    return this.activeStep();
  }

  set activeStepValue(value: number) {
    this.activeStep.set(value);
  }

  header: boolean = false;

  onSkillsSelected(skills: Skill[]) {
    this.header = true;
    this.selectedSkills.set(skills);
    if (skills.length > 0) {
      this.activeStep.set(this.activeStep() + 1);
    }
  }
  selectedIceBreaker: boolean = false;

  onIceBreakerSelected(selectedIceBreaker: IceBreaker) {
    this.selectedIceBreaker = true;
    this.activeStep.set(this.activeStep() + 1);
  }

  onStepChangeAttempt(step: number): void {
    if (step > this.activeStep()) {
      if (this.isStepInvalid(this.activeStep())) {
        this.triggerStepError(this.activeStep());
        return;
      }
    }

    this.activeStep.set(step);
  }

  private triggerStepError(step: number): void {
    this.stepErrors.set({ [step]: true });
  }

  private isStepInvalid(step: number): boolean {
    switch (step) {
      case 0:
        return this.selectedSkills().length === 0;
      case 1:
        return this.selectedIceBreaker == false;
      case 2:
        return this.selectedIceBreaker == false;
      default:
        return false;
    }
  }
}
