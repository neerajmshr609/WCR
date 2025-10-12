import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, forkJoin } from 'rxjs';
import {
  ADMIN_PAYOUT_REQUESTS_URL,
  ADMIN_PAYOUT_REQUEST_STATUS_URL,
  ADMIN_PAYOUT_REQUEST_URL,
  API_URL,
  ORGANIZATIONS_SKILLS_URL,
  ORGANIZATION_SKILLS_DELETE_URL,
  ORGANIZATION_URL,
} from 'src/config/config';
import { createHttpParams } from 'src/app/shared/functions/http-params';
import { Artcategory } from 'src/app/shared/models/artcategory.model';
import { Artfield } from 'src/app/shared/models/artfield.model';
import { Artrelation } from 'src/app/shared/models/Artrelation.model';
import { Category } from 'src/app/shared/models/category.model';
import { Project } from 'src/app/shared/models/project.model';
import { ProjectSkill } from 'src/app/shared/models/ProjectSkill.model';
import { Relation } from 'src/app/shared/models/relation.model';
import { Setting } from 'src/app/shared/models/setting.model';
import { Skill } from 'src/app/shared/models/skill.model';
import { User } from 'src/app/shared/models/user.model';
import { UserSkill } from 'src/app/shared/models/UserSkill.model';
import { PayoutRequest } from 'src/app/shared/models/payout-request.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  artCategories$ = new BehaviorSubject<Artcategory[]>([]);
  skills$ = new BehaviorSubject<Skill[]>([]);

  fetchedArtcategories: Artcategory[];

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
  ) {}

  // GENERAL

  fetchGreytmeUsersForProject(project_id: number) {
    const url = API_URL + 'users?greytme_team_project_rating=' + project_id;
    return this.http.get<User[]>(url);
  }

  // NEXTWORK

  fetchNextworkSettings() {
    const url = API_URL + 'settings?type=nextwork';
    return this.http.get<Setting[]>(url);
  }

  // PROJECTS

  fetchProjects() {
    const url = API_URL + 'projectsadmin/';
    return this.http.get<Project[]>(url);
  }

  // SETTINGS

  fetchSettings() {
    const url = API_URL + 'settings?type=app';
    return this.http.get<Setting[]>(url);
  }

  updateSetting(setting: Setting) {
    const url = API_URL + 'settings/' + setting.id;

    return this.http.put<Setting>(url, {
      setting,
    });
  }

  createSetting(setting: Setting) {
    const url = API_URL + 'settings/';

    return this.http.post<Setting>(url, {
      setting,
    });
  }

  // PARENT CATEGORIES

  createParentCategory(
    name: string,
    tag: string,
    artfield: number,
    categories: number[],
  ) {
    const url = API_URL + 'parentcategories/';
    return this.http.post<Category>(url, {
      parentcategory: {
        name,
        tag,
        artfield_id: artfield,
        category_ids: categories,
      },
    });
  }

  updateParentCategory(
    id: number,
    name: string,
    tag: string,
    artfield: number,
    categories: number[],
  ) {
    const url = API_URL + 'parentcategories/' + id;
    return this.http.put<Category>(url, {
      parentcategory: {
        name,
        tag,
        artfield_id: artfield,
        category_ids: categories,
      },
    });
  }

  deleteParentCategory(id: number) {
    const url = API_URL + 'parentcategories/' + id;
    return this.http.delete(url);
  }

  // RELATIONS

  fetchParentCategoryRelations(categoryID: number) {
    const url = API_URL + 'categoryrelations/?parentcategory_id=' + categoryID;
    return this.http.get<Relation[]>(url);
  }

  fetchArtcategories() {
    const url = API_URL + 'artcategories';

    return this.http.get<Artcategory[]>(url).pipe(
      tap((resData) => {
        this.fetchedArtcategories = resData;
      }),
    );
  }

  fetchRelationsForPerformance() {
    const url = API_URL + 'artrelations/?performance=true';
    return this.http.get<Relation[]>(url);
  }

  fetchArtrelations(categoryID?: number) {
    let finalURL = '/artrelations/';
    if (categoryID) {
      finalURL += '?category_id=' + categoryID;
    }

    const url = API_URL + finalURL;
    return this.http.get<Relation[]>(url);
  }

  createRelation(
    value: number,
    from?: number,
    to?: number,
    parentfrom?: number,
    parentto?: number,
  ) {
    const url = API_URL + 'categoryrelations/';
    return this.http.post<Relation>(url, {
      categoryrelation: {
        fromcategory_id: from,
        tocategory_id: to,
        fromparentcategory_id: parentfrom,
        toparentcategory_id: parentto,
        weight: value,
      },
    });
  }

  updateRelation(relation: Relation) {
    const url = API_URL + 'categoryrelations/' + relation.id;
    return this.http.put<Relation>(url, {
      categoryrelation: {
        fromcategory_id: relation.fromcategory_id,
        tocategory_id: relation.tocategory_id,
        fromparentcategory_id: relation.fromparentcategory_id,
        toparentcategory_id: relation.toparentcategory_id,
        weight: relation.weight,
      },
    });
  }

  createArtrelation(value: number, from?: number, to?: number) {
    const url = API_URL + 'artrelations/';
    return this.http.post<Artrelation>(url, {
      artrelation: {
        fromcategory_id: from,
        tocategory_id: to,
        weight: value,
      },
    });
  }

  updateArtrelation(relation: Artrelation) {
    const url = API_URL + 'artrelations/' + relation.id;
    return this.http.put<Artrelation>(url, {
      artrelation: {
        fromcategory_id: relation.fromcategory_id,
        tocategory_id: relation.tocategory_id,
        weight: relation.weight,
      },
    });
  }

  // SKILLS
  createSkill(skill: Skill) {
    const url = API_URL + 'admin/skills/';
    return this.http.post<Skill>(url, {
      skill,
    });
  }

  updateSkill(skill: Skill) {
    const url = API_URL + 'admin/skills/' + skill.id;
    return this.http.put<Skill>(url, {
      skill,
    });
  }

  deleteSkill(id: number) {
    const url = API_URL + 'admin/skills/' + id;
    return this.http.delete(url);
  }

  fetchSkills() {
    const url = API_URL + 'admin/skills/';

    return this.http
      .get<Skill[]>(url)
      .pipe(tap((res) => this.skills$.next(res)));
  }

  fetchSkillData() {
    const url = API_URL + 'skills/';
    return this.http
      .get<Skill[]>(url)
      .pipe(tap((res) => this.skills$.next(res)));
  }

  // CATEGORIES

  createCategory(name: string, tag: string, parentcategory_id: number) {
    const url = API_URL + 'categories/';
    return this.http.post<Category>(url, {
      category: {
        name,
        tag,
        parentcategory_id,
      },
    });
  }

  updateCategory(
    id: number,
    name: string,
    tag: string,
    parentcategory_id: number,
  ) {
    const url = API_URL + 'categories/' + id;
    return this.http.put<Category>(url, {
      category: {
        name,
        tag,
        parentcategory_id,
      },
    });
  }

  deleteCategory(id: number) {
    const url = API_URL + 'categories/' + id;
    return this.http.delete(url);
  }

  fetchParentCategories() {
    const url = API_URL + 'parentcategories/';
    return this.http.get<Category[]>(url);
  }

  // ART FIELDS

  fetchArtfields() {
    const url = API_URL + 'artfields/';
    return this.http.get<Artfield[]>(url);
  }

  updateArtfield(
    id: number,
    name: string,
    tag: string,
    parentcategories: number[],
  ) {
    const url = API_URL + 'artfields/' + id;
    return this.http.put<Artfield>(url, {
      artfield: {
        name,
        tag,
        parentcategory_ids: parentcategories,
      },
    });
  }

  createArtfield(name: string, tag: string) {
    const url = API_URL + 'artfields/';
    return this.http.post<Artfield>(url, {
      name,
      tag,
    });
  }

  fetchArtfield(id: number) {
    const url = API_URL + 'artfields/' + id;
    return this.http.get<Artfield>(url);
  }

  deleteArtfield(id: number) {
    const url = API_URL + 'artfields/' + id;
    return this.http.delete<Artfield>(url);
  }

  fetchFlatArtcategories(...filters: string[]) {
    const args = { flat: true };
    if (filters.length) {
      Object.assign(
        args,
        filters.reduce(
          (res, value) => Object.assign(res, { [value]: true }),
          {},
        ),
      );
    }
    const params = createHttpParams(args);
    const url = API_URL + 'artcategories';

    return this.http
      .get<Artcategory[]>(url, { params })
      .pipe(map((res) => this.artCategories$.next(res)));
  }

  bulkUpdateArtcategories(artcategories: Artcategory[]) {
    const url = API_URL + 'artcategories';

    return this.http.put(url, { artcategories });
  }

  addTag(artcategory_id: number, skill_id: number) {
    const url = API_URL + 'artcategory_skills';

    this.http.post(url, { artcategory_id, skill_id }).subscribe();
  }

  public getPayoutRequests() {
    return this.http.get(ADMIN_PAYOUT_REQUESTS_URL);
  }

  public editPayoutRequest(id: number, request: PayoutRequest) {
    return this.http.put(ADMIN_PAYOUT_REQUEST_URL(id), request);
  }

  public changePayoutStatus(id: number, status: string) {
    return this.http.put(ADMIN_PAYOUT_REQUEST_STATUS_URL(id), { status });
  }
}
