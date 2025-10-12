import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { IFilterPanelOutput } from '../../../complex-ui-components/filter-panel/filter-pannel.interface';
import { ArtCategory } from '../../../../services/artcategory/model/artcategory.model';
import { Skill } from '../../../../services/skill/model/skill.model';
import { toMeaningfulStr } from '../../../lib/string-helpers';
import { FilterPanelComponent } from '../../../complex-ui-components/filter-panel/filter-panel.component';
import { ExpertiseCardComponent } from '../expertise-card/expertise-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { ResizeService } from '../../../../services/resize.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { PlusIconComponent } from '../../../icons/plus-icon/plus-icon.component';
import {
  bounceInLeftOnEnterAnimation,
  bounceInOnEnterAnimation,
  bounceOutLeftOnLeaveAnimation,
  bounceOutOnLeaveAnimation,
  bounceOutRightOnLeaveAnimation,
  pulseOnEnterAnimation,
  slideOutLeftOnLeaveAnimation,
} from 'angular-animations';

@Component({
  selector: 'app-skill-filter',
  templateUrl: './skill-filter.component.html',
  styleUrls: ['./skill-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: [
    bounceInOnEnterAnimation(),
    bounceOutOnLeaveAnimation(),
    bounceInLeftOnEnterAnimation(),
    bounceOutLeftOnLeaveAnimation(),
    bounceOutRightOnLeaveAnimation(),
    pulseOnEnterAnimation(),
    slideOutLeftOnLeaveAnimation({ delay: 400 }),
  ],
  imports: [
    FilterPanelComponent,
    ExpertiseCardComponent,
    TranslateModule,
    NgClass,
    PlusIconComponent,
  ],
})
export class SkillFilterComponent {
  readonly artCategories = input.required<ArtCategory[]>();
  readonly skills = input.required<Skill[]>();
  readonly allowMultiselect = input(false);
  readonly displayStage = input(true);
  readonly displayColumn = input(false);
  readonly placeholder = input('Search');
  readonly isAddSkill = input(false);
  readonly getFilterResult = input(false);
  readonly filterChanged = output<IFilterPanelOutput<ArtCategory>>();
  readonly focusTextInput = output<FocusEvent>();
  readonly addedSkill = output<Skill>();

  public readonly skillFilters = signal<IFilterPanelOutput<ArtCategory> | null>(
    null,
  );
  private readonly _filteredSkills = computed(() => {
    const skillFilters = this.skillFilters();
    let loadedSkills = [...this.skills()];
    if (this.getFilterResult()) {
      this.filterChanged.emit(this.skillFilters());
      return loadedSkills;
    }

    if (skillFilters) {
      const { textFilter, selectedFilters } = skillFilters;
      if (textFilter) {
        const meaningfulFilterStr = toMeaningfulStr(textFilter);
        loadedSkills = loadedSkills.filter((_) =>
          _.contains(meaningfulFilterStr),
        );
      }
      if (selectedFilters.length) {
        loadedSkills = loadedSkills.filter((skill) =>
          skill.belongsTo(selectedFilters),
        );
      }
    }
    return loadedSkills;
  });
  private readonly _selectedSkills = signal<Skill[]>([]);

  readonly notSelectedSkills = computed(() => {
    const selectedSkills = this._selectedSkills();
    return this._filteredSkills().filter(
      (_) => !selectedSkills.some((skill) => skill.isEqualTo(_)),
    );
  });
  readonly selectedSkills = model<Skill[]>();

  readonly skillsAreSelected = computed(() => !!this.selectedSkills()?.length);
  readonly allowSelectMore = computed(() => {
    return this.allowMultiselect() || !this.skillsAreSelected();
  });

  readonly isNotMobile = toSignal(this._resizeService.isNotSmall$);
  readonly displayStageComputed = computed(
    () => this.isNotMobile() && this.displayStage(),
  );
  constructor(private readonly _resizeService: ResizeService) {
    effect(
      () => {
        const filteredSkills = this._filteredSkills();
        const filteredSelectedSkills = this._selectedSkills().filter((_) =>
          filteredSkills.some((skill) => skill.isEqualTo(_)),
        );
        this.selectedSkills.set(filteredSelectedSkills);
      },
      { allowSignalWrites: true },
    );
  }

  filtersChanged(state: IFilterPanelOutput<ArtCategory>) {
    this.skillFilters.set(state);
  }

  addToSelected(skill: Skill) {
    const index = this._selectedSkills().findIndex((_) => _.isEqualTo(skill));
    if (index === -1) {
      const updatedSelectedList = [...this._selectedSkills()];
      updatedSelectedList.push(skill);
      this._selectedSkills.set(updatedSelectedList);
    }
  }

  addSkill(skill: Skill) {
    this.addedSkill.emit(skill);
  }

  removeFromSelected(skill: Skill) {
    const updatedSelectedList = this._selectedSkills().filter(
      (_) => !_.isEqualTo(skill),
    );
    this._selectedSkills.set(updatedSelectedList);
  }
}
