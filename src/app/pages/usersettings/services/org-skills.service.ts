import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { UserSkill } from 'src/app/shared/models/UserSkill.model';
import {
  ORGANIZATION_SKILLS_DELETE_URL,
  ORGANIZATION_URL,
  ORGANIZATIONS_SKILLS_URL,
} from 'src/config/config';

@Injectable({
  providedIn: 'any',
})
export class OrgSkillsService {
  constructor(private http: HttpClient) {}

  fetchOrgSkills(id: number) {
    return this.http.get(ORGANIZATION_URL(id));
  }

  createOrgSkill(organization_id: number, skill_id: number, level: number) {
    return this.http
      .post<UserSkill>(ORGANIZATIONS_SKILLS_URL, {
        organization_id,
        skill_id,
        level,
      })
      .pipe(
        catchError(() => {
          return EMPTY;
        }),
      );
  }

  updateOrgSkill(organization_id: number, skill_id: number, level: number) {
    return this.http.put<UserSkill>(ORGANIZATIONS_SKILLS_URL, {
      organization_id,
      skill_id,
      level,
    });
  }

  deleteOrgSkill(organization_id: number, skill_id: number) {
    return this.http.delete(
      ORGANIZATION_SKILLS_DELETE_URL(organization_id, skill_id),
    );
  }
}
