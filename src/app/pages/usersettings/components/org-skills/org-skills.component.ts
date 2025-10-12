import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { Skill } from 'src/app/shared/models/skill.model';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { IOrganization } from '../../interfaces';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { OrgSkillsService } from '../../services/org-skills.service';
import { SkillsService } from '../../../../services/skill/skills.service';

@Component({
  selector: 'app-org-skills',
  templateUrl: './org-skills.component.html',
  styleUrls: ['./org-skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgSkillsComponent
  extends BaseComponent
  implements OnInit, OnChanges, OnDestroy
{
  org = input<IOrganization>();

  user = signal<User | null>(null);
  allSkills = signal<Skill[]>([]);
  filteredSkills = signal<Skill[]>([]);
  skillsForAddedFields = signal<Skill[]>([]);
  skills = signal<Skill[]>([]);
  isMobile = signal<boolean>(false);

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private translate: TranslateService,
    private orgSkillsService: OrgSkillsService,
    private skillService: SkillsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAllSkills();
    this.observeMobileSize();

    this.authService.userSubject$
      .pipe(takeUntil(this.destroyed))
      .subscribe((user) => {
        this.user.set(user);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.org && changes.org.currentValue) {
      this.getSkills();
    }
  }

  private observeMobileSize(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((state) => {
        this.isMobile.set(state.matches);
      });
  }

  private getAllSkills(): void {
    this.skillService.skills$
      .pipe(
        takeUntil(this.destroyed),
        filter((skills) => skills.length > 0),
      )
      .subscribe((skills) => {
        this.allSkills.set(skills);
      });
  }

  private getSkills(): void {
    this.orgSkillsService
      .fetchOrgSkills(this.org().id)
      .pipe(takeUntil(this.destroyed))
      .subscribe((org: IOrganization) => {
        this.skills.set(org.org_skills);
        this.filterSkills();
      });
  }

  private filterSkills(): void {
    const selectedSkills = this.skills().map((skill) => skill.id);
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
    this.orgSkillsService
      .createOrgSkill(this.org().id, skill.id, level)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.getSkills();
        this.showPopup();
      });
  }

  editSkill(skill): void {
    this.orgSkillsService
      .updateOrgSkill(this.org().id, skill.skill, skill.level)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.showPopup();
      });
  }

  deleteSkill(skillID: number): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      maxWidth: this.isMobile() ? '320px' : '450px',
      width: '100%',
      data: {
        title: 'skill_deletion_confilmation.title',
        subtitle: 'skill_deletion_confilmation.subtitle',
        question: 'skill_deletion_confilmation.question',
        cancel_btn: 'skill_deletion_confilmation.cancel_btn',
        confirm_btn: 'skill_deletion_confilmation.confirm_btn',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => {
        this.orgSkillsService
          .deleteOrgSkill(this.org().id, skillID)
          .pipe(takeUntil(this.destroyed))
          .subscribe(() => {
            this.getSkills();
          });
      });
  }

  ngOnDestroy(): void {
    this.destroyed.unsubscribe();
  }
}
