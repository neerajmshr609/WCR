import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Artcategory } from '../shared/models/artcategory.model';
import { Skill } from '../shared/models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public currentPage$ = new BehaviorSubject<string>(null);

  public selectedMediatypes$ = new BehaviorSubject<string[]>([]);
  public selectedCategories$ = new BehaviorSubject<Artcategory[]>([]);
  public selectedSkills$ = new BehaviorSubject<Skill[]>([]);
  public selectedOnline$ = new BehaviorSubject<boolean>(false);

  constructor() {}
}
