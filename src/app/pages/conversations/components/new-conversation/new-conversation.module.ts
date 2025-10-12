import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NewConversationComponent } from './new-conversation.component';
import { ButtonComponent } from 'src/app/shared/UIkit/button/button.component';
import { CloseIconComponent } from 'src/app/shared/icons/close-icon/close-icon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectComponent } from 'src/app/shared/UIkit/select/select.component';
import { InputComponent } from 'src/app/shared/UIkit/input/input.component';
import { UserUploadImageService } from 'src/app/services/upload-image.service';
import { ImageUploaderComponent } from 'src/app/shared/complex-ui-components/image-uploader/image-uploader.component';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';
import { AutocompleteModule } from '../../../../shared/UIkit/autocomplete/autocomplete.module';

@NgModule({
  declarations: [NewConversationComponent],
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ButtonComponent,
    CloseIconComponent,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SelectComponent,
    InputComponent,
    ImageUploaderComponent,
    AutocompleteModule,
  ],
  providers: [UserUploadImageService, UploaderService],
})
export class NewConversationModule {}
