import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, tap, filter } from 'rxjs/operators';
import { Artcategory } from 'src/app/shared/models/artcategory.model';
import { Tag } from 'src/app/shared/models/skill.model';
import { AdminService } from '../../../admin.service';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent implements OnInit {
  @Input() tags: Tag[];
  @Output() updateTags = new EventEmitter<Tag[]>();

  @ViewChild('viewPort') viewPort: CdkVirtualScrollViewport;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  control = new UntypedFormControl();
  height: number;

  options$: Observable<Artcategory[]>;
  selectedOptions = new Array<Tag>();

  constructor(private adminService: AdminService) {
    this.options$ = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
      filter((res) => !!res),
      tap((res) => (this.height = res.length <= 4 ? res.length * 48 : 240)),
    );
  }

  ngOnInit(): void {
    this.selectedOptions = [...this.tags];
  }

  remove(index: number): void {
    this.selectedOptions.splice(index, 1);
    this.parseTags();
  }

  isSelected(option: Artcategory) {
    return this.selectedOptions.find((o) => option.id === o.artcategory_id);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    this.selectedOptions.push({ artcategory_id: value.id, name: value.name });
    this.parseTags();
    this.control.setValue(null);
  }

  parseTags() {
    this.tags = [...this.selectedOptions];
    this.updateTags.emit(this.tags);
  }

  private _filter(value: string): Artcategory[] {
    if (typeof value !== 'string') {
      return;
    }
    const filterValue = value.toLowerCase();
    const options = this.adminService.artCategories$.value;

    return options.filter(
      (option) => option.name.toLowerCase().indexOf(filterValue) !== -1,
    );
  }

  panelOpened() {
    if (this.viewPort) {
      this.viewPort.checkViewportSize();
    }
  }
}
