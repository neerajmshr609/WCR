import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Skill, skillFactory } from './model/skill.model';
import { finalize, map, switchMap } from 'rxjs/operators';
import { ISkill } from './model/response/skill.interface';
import { SKILL_API_URL_PROVIDER_KEY } from './skill-api-urls.provider';
import { ApiUrlsProvider } from '../../shared/lib/api-urls-provider.lib';
import { isNotLoading } from '../../shared/lib/api-interaction.helpers';
import { API_URL } from '../../../config/config';
import { UserSkill } from '../../shared/models/UserSkill.model';
import { ProjectSkill } from '../../shared/models/ProjectSkill.model';

@Injectable({
  providedIn: 'any',
})
export class SkillsService {
  constructor(
    @Inject(SKILL_API_URL_PROVIDER_KEY)
    private readonly _skillApiUrls: ApiUrlsProvider,
    private readonly _httpClient: HttpClient,
  ) {}

  private readonly _skills$ = new BehaviorSubject<Skill[]>([]);
  readonly skills$ = this._skills$.asObservable();
  private readonly _isLoading$ = new BehaviorSubject(false);
  readonly isLoading$ = this._isLoading$.asObservable();

  private _setLoadingStarts() {
    this._isLoading$.next(true);
  }

  private _setLoadingCompleted() {
    this._isLoading$.next(false);
  }

  private _setSkills(skills: Skill[]) {
    this._skills$.next(skills);
  }

  fetchSkills() {
    isNotLoading(this)
      .pipe(
        switchMap(() => {
          this._setLoadingStarts();
          return this._httpClient.get<ISkill[]>(this._skillApiUrls.GET);
        }),
        finalize(() => this._setLoadingCompleted()),
        map((_) => _.map(skillFactory)),
      )
      .subscribe((_) => this._setSkills(_));
  }

  public fetchUserSkills(userId: number) {
    const url = API_URL + 'user_skills?user_id=' + userId;
    return this._httpClient.get<UserSkill[]>(url);
  }

  public deleteUserSkill(id: number) {
    const url = API_URL + 'user_skills/' + id;
    return this._httpClient.delete(url);
  }

  public updateUserSkill(updated: { id: number; skill: UserSkill }) {
    const url = API_URL + 'user_skills/' + updated.id;
    return this._httpClient.put<UserSkill>(url, {
      user_skill: {
        ...updated.skill,
      },
    });
  }

  public updateUserSkillsOrder(userSkills: Array<UserSkill>) {
    const updateUserSkills$ = userSkills.map((skill) =>
      this.updateUserSkillPosition(skill.id, skill.order),
    );
    return forkJoin([...updateUserSkills$]);
  }

  updateUserSkillPosition(id: number, order: number) {
    const url = API_URL + 'user_skills/' + id;
    return this._httpClient.put<UserSkill>(url, {
      user_skill: {
        order,
      },
    });
  }

  createUserSkill(
    user_id: number,
    skill_id: number,
    level: number,
    rate: number,
  ) {
    const url = API_URL + 'user_skills/';
    return this._httpClient.post<UserSkill>(url, {
      user_skill: {
        user_id,
        skill_id,
        level,
        rate,
      },
    });
  }

  createProjectSkill(project_id: number, skill_id: number) {
    const url = API_URL + 'project_skills/';
    return this._httpClient.post<ProjectSkill>(url, {
      project_skill: {
        project_id,
        skill_id,
      },
    });
  }

  deleteProjectSkill(id: number) {
    const url = API_URL + 'project_skills/' + id;
    return this._httpClient.delete(url);
  }
}
