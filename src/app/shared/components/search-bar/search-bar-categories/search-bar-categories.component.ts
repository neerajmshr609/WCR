import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { takeUntil, startWith, map, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Artcategory } from 'src/app/shared/models/artcategory.model';
import { ProjectService } from 'src/app/services/project.service';
import { SearchService } from 'src/app/services/search.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-bar-categories',
  templateUrl: './search-bar-categories.component.html',
  styleUrls: ['./search-bar-categories.component.scss'],
})
export class SearchBarCategoriesComponent
  extends BaseComponent
  implements OnInit
{
  @ViewChild('autocomplete') autocomplete: ElementRef;

  public myControl = new UntypedFormControl();
  public selectedMediatypes = new Set<string>();
  public filteredOptions: Observable<Artcategory[]>;

  private selectedOptions = [];
  private allCategories: Artcategory[];

  constructor(
    private projectService: ProjectService,
    private searchService: SearchService,
  ) {
    super();
  }

  ngOnInit() {
    this.subscribeToRouter();
    this.fetchArtcategories();
  }

  private subscribeToRouter() {
    this.searchService.selectedCategories$
      .pipe(
        takeUntil(this.destroyed),
        tap((res) => (this.selectedOptions = res)),
      )
      .subscribe();
  }

  private fetchArtcategories() {
    this.projectService
      .fetchArtcategories()
      .pipe(takeUntil(this.destroyed))
      .subscribe((categories) => {
        this.allCategories = categories;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          takeUntil(this.destroyed),
          startWith(''),
          map((value) => (typeof value === 'string' ? value : value.name)),
          map((name) =>
            name ? this._filter(name) : this.allCategories.slice(),
          ),
        );
      });
  }

  private _filter(name: string): Artcategory[] {
    const filterValue = name.toLowerCase();

    return this.allCategories.filter(
      (option) => option.name.toLowerCase().indexOf(filterValue) > -1,
    );
  }

  toggleMediatype(type: string) {
    if (this.selectedMediatypes.has(type)) {
      this.selectedMediatypes.delete(type);
    } else {
      this.selectedMediatypes.add(type);
    }

    const array = Array.from(this.selectedMediatypes.values());
    this.searchService.selectedMediatypes$.next(array);
  }

  searchDidSelectOption(option: MatAutocompleteSelectedEvent) {
    this.autocomplete.nativeElement.blur();

    if (option) {
      const index = this.selectedOptions.findIndex(
        (o) => o.id === option.option.value.id,
      );
      if (index === -1) {
        this.selectedOptions.push(option.option.value);
      }
      this.myControl.setValue('');
    }

    this.updateCategoriesSubscription();
  }

  removeSearchResult(option: Artcategory) {
    const index = this.selectedOptions.findIndex((o) => o.id === option.id);
    this.selectedOptions.splice(index, 1);
    this.updateCategoriesSubscription();
  }

  updateCategoriesSubscription() {
    this.searchService.selectedCategories$.next(this.selectedOptions);
  }
}
