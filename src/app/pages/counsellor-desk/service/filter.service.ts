import { computed, Injectable, signal } from '@angular/core';
import { Skill } from '../../../shared/models/skill.model';
import { FILTERS_MOCK } from '../MOCK';

@Injectable({
  providedIn: 'any',
})
export class FilterService {
  private readonly _skillFilters = signal<any[]>(FILTERS_MOCK);
  readonly skillFilters = computed(() => this._skillFilters());

  remove(skill: Skill): void {
    const newList = this._skillFilters().filter((_) => _.id !== skill.id);
    this._skillFilters.set(newList);
  }
}
