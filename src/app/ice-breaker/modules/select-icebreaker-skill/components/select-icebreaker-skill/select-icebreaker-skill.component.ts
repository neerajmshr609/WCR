import {
  ChangeDetectionStrategy,
  Component,
  effect,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../../../../../auth/auth.service';
import { UserSkill } from '../../../../../shared/models/UserSkill.model';
import { OnboardingModalComponent } from '../../../../../shared/components/onboarding-modal/onboarding-modal.component';
import { SkillsService } from '../../../../../services/skill/skills.service';
import { Skill } from '../../../../../services/skill/model/skill.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { ArtcategoriesService } from '../../../../../services/artcategory/artcategories.service';
import { SkillFilterComponent } from '../../../../../shared/model-based-components/skill/skill-filter/skill-filter.component';
import { ResizeService } from '../../../../../services/resize.service';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { IceBreakerService } from 'src/app/ice-breaker/service/ice-breaker.service';

@Component({
  selector: 'app-select-icebreaker-skill',
  templateUrl: './select-icebreaker-skill.component.html',
  styleUrls: ['./select-icebreaker-skill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectIcebreakerSkillComponent implements OnInit, OnDestroy {
  private destroy = new Subject();

  readonly selectedSkills = signal<Skill[]>([]);
  readonly artCategories = toSignal(this._artCategoriesService.artCategories$);
  readonly skills = toSignal(this.skillsService.skills$);
  readonly isNotDesktop = toSignal(this._resizeService.isNotDesktopScreen$);
  @ViewChild(SkillFilterComponent) skillFilterComponent: SkillFilterComponent;

  constructor(
    private readonly dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
    private readonly skillsService: SkillsService,
    private _artCategoriesService: ArtcategoriesService,
    private _resizeService: ResizeService,
    private readonly _iceBreakerService: IceBreakerService,
  ) {
    this.loadPublicProfile();
    effect(() => {
      if (this.selectedSkills() && this.selectedSkills().length > 0) {
        this.selectSkill(this.selectedSkills());
      }
    });
  }

  ngOnInit(): void {
    this.skillsService.fetchSkills();
    this._artCategoriesService.fetchArtcategories({ bound_to_skill: true });
  }

  async selectSkill(projectSkill: Skill[]): Promise<void> {
    if (!this.authService.userIsSignedIn()) {
      this.dialog.open(OnboardingModalComponent, {
        maxWidth: '92vw',
        width: '360px',
        height: '760px',
        maxHeight: '92vh',
        autoFocus: false,
        panelClass: 'modal',
        data: { step: 5 },
      });
      return;
    }
    const { user_skills } = await firstValueFrom(
      this.profileService.publicProfile$,
    );
    const selectedSkill = projectSkill[0];
    const newSkill = {
      user_id: this.authService.userSubject$.value.id,
      skill_id: selectedSkill.id,
      level: 1,
      rate: this.authService.userSubject$.value.advisorrate || 45,
    };
    const proceedModalRef =
      await this._iceBreakerService.openModalIceBreakerCreationConfirmation(
        selectedSkill.name,
      );
    proceedModalRef
      .afterClosed()
      .pipe(
        tap((_) => {
          if (this.skillFilterComponent) {
            this.skillFilterComponent.removeFromSelected(selectedSkill);
          }
        }),
        filter((confirm) => confirm),
        filter(() => {
          const foundedUserSkill = user_skills.find(
            (skill) => skill.skill.id === newSkill.skill_id,
          );
          if (foundedUserSkill) {
            this._iceBreakerService.navigateToIceBreakerCreation(
              foundedUserSkill.id,
            );
            return false;
          }
          return true;
        }),
        switchMap(() => {
          return this.skillsService
            .createUserSkill(
              newSkill.user_id,
              newSkill.skill_id,
              newSkill.level,
              newSkill.rate,
            )
            .pipe(
              tap((res: UserSkill) => {
                this._iceBreakerService.navigateToIceBreakerCreation(res.id);
              }),
            );
        }),
        takeUntil(this.destroy),
      )
      .subscribe();
  }

  private loadPublicProfile(): void {
    this.authService.userSubject$
      .pipe(
        filter((user) => !!user),
        tap((user) => this.profileService.fetchProfile(user.sharetoken)),
        takeUntil(this.destroy),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.unsubscribe();
  }
}
