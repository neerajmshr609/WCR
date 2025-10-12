import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../../../../auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../../../../../shared/models/user.model';
import { ProfileStoreService } from '../../../profile-store.service';
import { Skill } from '../../../../../../shared/models/skill.model';
import { UserSkill } from '../../../../../../shared/models/UserSkill.model';
import { SeoService } from '../../../../../../services/seo.service';
import { tap } from 'rxjs/operators';
import { getUserSeoData } from '../../../../../../shared/functions/get-user-seo-data';

@Component({
  selector: 'app-skills-tools',
  templateUrl: './skills-tools.component.html',
  styleUrls: ['./skills-tools.component.scss'],
})
export class SkillsToolsComponent implements OnInit, OnDestroy {
  publicProfile$: Observable<User>;
  currentUser$: Observable<any>;
  sortSkillsChange = new EventEmitter<void>();
  pickedProfileSkill$: Observable<UserSkill> = this.profileStore.pickedSkill$;

  constructor(
    private authService: AuthService,
    private readonly seoService: SeoService,
    private profileStore: ProfileStoreService,
  ) {}

  ngOnInit(): void {
    this.publicProfile$ = this.profileStore.publicProfile$.pipe(
      tap((user: User) => {
        const { title, description, image, url } = getUserSeoData(user);
        this.seoService.setSettings({ title, image, description, url });
      }),
    );
    this.currentUser$ = this.authService.userSubject$;
  }

  pickCardSkill(skill: Skill): void {
    this.profileStore.pickSkill(skill);
  }

  ngOnDestroy(): void {
    this.profileStore.pickSkill(null);
  }
}
