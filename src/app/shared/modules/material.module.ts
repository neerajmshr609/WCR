import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MatNativeDateModule,
  NativeDateAdapter,
} from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';

export class CustomDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}
@NgModule({
  declarations: [],
  imports: [
    MatGridListModule,
    MatDatepickerModule,
    MatDialogModule,
    MatRadioModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTabsModule,
    MatSnackBarModule,
  ],
  exports: [
    MatGridListModule,
    MatDatepickerModule,
    MatDialogModule,
    MatRadioModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTabsModule,
    MatSnackBarModule,
  ],
  providers: [{ provide: DateAdapter, useClass: CustomDateAdapter }],
})
export class MaterialModule {}
