import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
  signal,
  OnDestroy,
  model,
  effect,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, EMPTY, filter, of, Subscription, takeUntil } from 'rxjs';
import { IceBreaker } from 'src/app/ice-breaker/modules/ice-breaker-template/ice-breaker-template-messages';
import { AdvisorsService } from 'src/app/services/advisors.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { User } from 'src/app/shared/models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UserSkill } from 'src/app/shared/models/UserSkill.model';
import { SkillsService } from '../../../../services/skill/skills.service';
import { Skill } from '../../../../services/skill/model/skill.model';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicsComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  userSkillDeleted = output<number>();

  user = signal<User | null>(null);
  allSkills = model<Skill[]>([]);
  skills = model<UserSkill[]>([]);
  filteredSkills = model<Skill[]>([]);
  isMobile = signal<boolean>(false);

  private subscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private advisorService: AdvisorsService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private skillService: SkillsService,
    private snackbar: MatSnackBar,
  ) {
    super();
  }

  ngOnInit(): void {
    this.authService.userSubject$
      .pipe(takeUntil(this.destroyed))
      .subscribe((user) => {
        this.user.set(user);
      });
    this.getAllSkills();
    this.observeMobileSize();
  }

  private observeMobileSize(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((state) => {
        this.isMobile.set(state.matches);
      });
  }

  getAllSkills(): void {
    this.skillService.skills$
      .pipe(
        takeUntil(this.destroyed),
        filter((skills) => skills.length > 0),
      )
      .subscribe((skills) => {
        this.allSkills.set(skills);
        this.getSkills();
      });
  }

  getSkills(): void {
    this.skillService
      .fetchUserSkills(this.user().id)
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        this.skills.set((res as any).sort((a, b) => a.order - b.order));
        this.filterSkills();
      });
  }

  private filterSkills() {
    const selectedSkills = this.skills().map((skill) => skill.skill.id);
    const remainingSkills = this.allSkills().filter(
      (skill) => !selectedSkills.includes(skill.id),
    );

    this.filteredSkills.set(remainingSkills);
  }

  showPopup(): void {
    this.translate.get('messages.saved').subscribe((message) => {
      this.snackBar.open(message, null, {
        duration: 3000,
      });
    });
  }

  onSave(newSkill): void {
    const { skill, level } = newSkill;
    const selectedSkill = this.allSkills().find((s) => s.id === skill);
    if (selectedSkill) {
      this.addSkill(level, selectedSkill);
    }
  }

  private addSkill(level: number, skill: Skill): void {
    this.subscription?.unsubscribe();

    this.subscription = this.skillService
      .createUserSkill(this.user().id, skill.id, level, 1)
      .pipe(
        catchError(() => {
          this.snackbar.open('Something went wrong!', '', {
            duration: 4000,
          });
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.getSkills();
        this.showPopup();
      });
  }

  deleteSkill(skillID: number): void {
    const userSkillsForIceBreakerPicked =
      this.advisorService.publicProfile.value?.icebreakers?.map(
        (iceBreaker: IceBreaker) => {
          return iceBreaker.user_skill_id;
        },
      );

    const isPickedSkillInIceBreaker = this.skills().some(() => {
      return userSkillsForIceBreakerPicked?.indexOf(skillID) !== -1;
    });

    const excludeSkillFromSkills = () => {
      const _filteredSkills = this.skills().filter((obj) => {
        return obj.id !== skillID;
      });

      this.skills.set(_filteredSkills);
    };

    if (isPickedSkillInIceBreaker) {
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        maxWidth: this.isMobile() ? '320px' : '450px',
        width: '100%',
        data: {
          title: 'topic_confilmation.title',
          subtitle: 'topic_confilmation.subtitle',
          question: 'topic_confilmation.question',
          cancel_btn: 'topic_confilmation.cancel_btn',
          confirm_btn: 'topic_confilmation.confirm_btn',
        },
      });

      dialogRef
        .afterClosed()
        .pipe(
          filter((confirm) => confirm),
          catchError(() => {
            // incomplete
            return of({});
          }),
        )
        .subscribe(() => {
          this.skillService.deleteUserSkill(skillID).subscribe(() => {
            this.userSkillDeleted.emit(skillID);
            this.getSkills();

            excludeSkillFromSkills();
          });
        });
      return;
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.skills(), event.previousIndex, event.currentIndex);
    this.skills().forEach((skill, index) => (skill.order = index));
    this.editOrder();
  }

  editOrder(): void {
    this.skillService.updateUserSkillsOrder(this.skills()).subscribe(() => {
      this.showPopup();
    });
  }

  editSkill(data: { skill: Skill; id: number }): void {
    this.skillService.updateUserSkill(data).subscribe(() => {
      this.showPopup();
    });
  }

  ngOnDestroy(): void {
    this.destroyed.unsubscribe();
  }
}
