import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MySkillsSelectComponent } from './my-skills-select.component';
import { SmallSpinnerModule } from '../../../shared/components/small-spinner/small-spinner.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CantFindSkillDialogComponent } from './components/cant-find-skill-dialog/cant-find-skill-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [MySkillsSelectComponent, CantFindSkillDialogComponent],
  exports: [MySkillsSelectComponent, MySkillsSelectComponent],
  imports: [
    CommonModule,
    SmallSpinnerModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
})
export class SkillSelectModuleModule {}
