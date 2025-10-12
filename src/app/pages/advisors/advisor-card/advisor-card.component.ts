import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from 'src/app/shared/models/project.model';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Conversation } from 'src/app/shared/models/conversation.model';
import { RateflowService } from 'src/app/services/rateflow.service';
import { delay, finalize, takeUntil, tap } from 'rxjs/operators';
import { AdvisorsService } from '../services/advisors.service';
import { User } from 'src/app/shared/models/user.model';
import { UserSkill } from 'src/app/shared/models/UserSkill.model';
import { Skill } from '../../../shared/models/skill.model';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-advisor-card',
  templateUrl: './advisor-card.component.html',
  styleUrls: ['./advisor-card.component.scss'],
})
export class AdvisorCardComponent extends BaseComponent implements OnInit {
  @ViewChild('requestRef') requestRef: ElementRef;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  @Input() currentUser: User;
  @Input() advisor: User;
  @Input() currentUserProjects: Project[];
  @Input() sortSkillsChange: Observable<void>;

  @Input() set pickedSkill(pickedSkill: Skill) {
    if (pickedSkill) {
      this.selectedUserSkill = this.advisor.user_skills.find(
        (userSkill: UserSkill) => userSkill.skill.id === pickedSkill.id,
      );
      if (this.selectedUserSkill) {
        this.selectedDisplayType = 'detail';
        this.selectedSkillChanged$.next(this.selectedUserSkill);
      } else {
        this.selectedDisplayType = 'overview';
      }
    }
  }

  @Output() pinToTop = new EventEmitter();
  @Output() selectCardSkill: EventEmitter<UserSkill> =
    new EventEmitter<UserSkill>();

  selectedDisplayType = 'overview';
  selectedUserSkill: UserSkill;

  selectedOverviewSkill: UserSkill;
  selectedSkillChanged$ = new BehaviorSubject<UserSkill>(null);
  selectedSkillUpdated$ = new BehaviorSubject<UserSkill>(null);

  conversation: Conversation;
  langs = [];
  hidden: boolean;
  unselectEvt = new EventEmitter<UserSkill>();
  userSkills: UserSkill[] = [];

  processing: boolean;
  trackById = (index, entity) => entity.id;

  constructor(
    private rateflowService: RateflowService,
    private authService: AuthService,
    private advisorService: AdvisorsService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.userSkills = [...this.advisor.user_skills];
    if (this.advisor.lang) {
      this.langs = this.advisor.lang.split(',');
    } else {
      this.langs.push('non-selected');
    }

    this.sortSkillsChange
      .pipe(
        tap(() => (this.hidden = true)),
        delay(0),
        tap(() => (this.hidden = false)),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  skillDidChangeSelectionState(skill: UserSkill) {
    this.unselectEvt.emit(skill);

    if (skill === this.selectedSkillUpdated$.value) {
      this.selectedOverviewSkill = null;
      this.selectedSkillUpdated$.next(null);
    } else {
      this.selectedOverviewSkill = skill;
      this.selectedSkillUpdated$.next(skill);
    }
  }

  onAddToMyAdvisors(advisorID: number) {
    this.currentUser.adviserIDs.push(advisorID);
    this.rateflowService
      .addAdviserToFavorites(advisorID, this.currentUser.id)
      .subscribe();
  }

  onRemoveFromMyAdvisors(advisorID: number) {
    this.currentUser.adviserIDs = this.currentUser.adviserIDs.filter(
      (obj) => obj !== advisorID,
    );
    this.rateflowService
      .removeAdviserFromFavorites(advisorID, this.currentUser.id)
      .subscribe();
  }

  selectSkill(skill: UserSkill) {
    this.selectedUserSkill = skill;
    this.selectedSkillChanged$.next(this.selectedUserSkill);
    this.selectedDisplayType = skill == null ? 'overview' : 'detail';
    this.selectCardSkill.emit(skill);
  }

  public onPinToTopClick(event): void {
    event.stopPropagation();

    this.processing = true;

    let pinnedAdvsorIds = this.currentUser.pinned_advisors;
    const advisorId = this.advisor.id;

    if (pinnedAdvsorIds.includes(advisorId)) {
      pinnedAdvsorIds = pinnedAdvsorIds.filter((id) => id !== advisorId);
    } else {
      pinnedAdvsorIds.push(this.advisor.id);
    }

    this.advisorService
      .addAdvisorToPinned(pinnedAdvsorIds, this.currentUser.id)
      .pipe(
        takeUntil(this.destroyed),
        finalize(() => (this.processing = false)),
      )
      .subscribe(() => {
        this.currentUser.pinned_advisors = pinnedAdvsorIds;
        this.advisor.pinned = !this.advisor.pinned;
        this.menuTrigger.closeMenu();
        this.pinToTop.emit();
      });
  }
}
