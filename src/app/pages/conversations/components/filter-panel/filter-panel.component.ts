import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { SearchComponent } from '../../../../shared/UIkit/search/search.component';
import { TypeMultiSelectComponent } from '../../../../shared/components/multi-select/type-multi-select.component';
import { PlusIconComponent } from '../../../../shared/icons/plus-icon/plus-icon.component';
import {
  clientFilterSelectItems,
  filterSelectItems,
} from '../../../constants/filter-select-items';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../../shared/models/user.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { NewConversationComponent } from '../new-conversation/new-conversation.component';
import { NewConversationModule } from '../new-conversation/new-conversation.module';
import { ConversationFilterItem } from '../../../../shared/models/conversation-filter-item';
import { BaseComponent } from '../../../../shared/components/base.component';
import { debounceTime, map, take, takeUntil } from 'rxjs/operators';
import { returnTypeEntity } from '../../../../shared/functions/converstion-types-adapter';
import { PermissionService } from '../../../../auth/service/permission.service';
import {
  Conversation,
  ConversationStateType,
  ConversationType,
} from '../../../../shared/models/conversation.model';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  standalone: true,
  imports: [
    SearchComponent,
    TypeMultiSelectComponent,
    PlusIconComponent,
    ReactiveFormsModule,
    TranslateModule,
    NewConversationModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./filter-panel.component.scss'],
})
export class FilterPanelComponent extends BaseComponent implements OnInit {
  public filtersForm = new FormGroup({
    search: new FormControl<string>(null, []),
    types: new FormControl<ConversationFilterItem[]>(null, []),
  });
  public currentUser = input<User>();
  public readonly filterItems = signal(null);
  public filterChanged = output<any>();
  public selectedEntity =
    output<(ConversationType | ConversationStateType)[]>();
  public newConversation = output<Conversation>();

  constructor(
    private dialog: MatDialog,
    private permissionService: PermissionService,
  ) {
    super();
  }

  addNewConversation(): void {
    const dialogRef = this.dialog.open(NewConversationComponent, {
      maxWidth: '464px',
      width: '100%',
      data: {
        title: 'new_chat.title',
        cancel_btn: 'new_chat.cancel_btn',
        confirm_btn: 'new_chat.confirm_btn',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.newConversation.emit(result);
        }
      });
  }

  ngOnInit(): void {
    this.permissionService.permissions$.subscribe((permissions) => {
      this.filterItems.set(
        permissions.isCounselor() ? filterSelectItems : clientFilterSelectItems,
      );
    });
    this.filtersForm
      .get('types')
      .valueChanges.pipe(takeUntil(this.destroyed))
      .subscribe((types) => {
        this.selectedEntity.emit(types.map((type) => type.name));
        const body: { search?: any; types?: any[]; scheduled?: boolean } = {};
        const scheduled = types.find((value) => value.name === 'scheduled');
        if (scheduled) {
          body.scheduled = true;
        }

        const filtersQuery = this.getTypes(types);
        if (filtersQuery.length > 0) {
          body.types = filtersQuery;
        }
        this.filterChanged.emit({
          ...body,
          search: this.filtersForm.get('search').value,
        });
      });

    this.filtersForm
      .get('search')
      .valueChanges.pipe(
        debounceTime(1000),
        map((value) => value.trim()),
        takeUntil(this.destroyed),
      )
      .subscribe((search) => {
        this.filterChanged.emit({
          search,
          types: this.getTypes(this.filtersForm.get('types').value || []),
        });
      });
  }

  private getTypes(types) {
    return types
      .filter((value) => value.name !== 'scheduled')
      .map((type) => returnTypeEntity(type.name));
  }
}
