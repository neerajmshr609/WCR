import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentEditableFieldComponent } from './content-editable-field.component';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
  declarations: [ContentEditableFieldComponent],
  exports: [ContentEditableFieldComponent],
  imports: [CommonModule, FormsModule, TextFieldModule],
})
export class ContentEditableFieldModule {}
