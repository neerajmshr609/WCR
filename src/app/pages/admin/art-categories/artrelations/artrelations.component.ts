import { Component, Input, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { filter, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Artcategory } from 'src/app/shared/models/artcategory.model';
import { Artrelation } from 'src/app/shared/models/Artrelation.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-artrelations',
  templateUrl: './artrelations.component.html',
  styleUrls: ['./artrelations.component.scss'],
})
export class ArtrelationsComponent extends BaseComponent implements OnInit {
  loadedRelations: Artrelation[];

  categoryName: string;
  categoryID: number;

  @Input() artCategories: Artcategory[];
  @Input() selectedCategorySub: BehaviorSubject<Artcategory>;

  constructor(
    private snackBar: MatSnackBar,
    private adminService: AdminService,
  ) {
    super();
  }

  ngOnInit() {
    this.selectedCategorySub
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        tap((category) => {
          this.categoryID = category.id;
          this.categoryName = category.name;
        }),
        mergeMap(() => this.adminService.fetchArtrelations(this.categoryID)),
        tap((res) => (this.loadedRelations = res)),
      )
      .subscribe();
  }

  onCategoryRelationChange(category: Artcategory, inputValue: number) {
    const networkCalls = [];

    let relation: Artrelation;

    const existing = this.loadedRelations.find((element) => {
      return element.tocategory_id === category.id;
    });

    if (existing) {
      existing.weight = +inputValue;
      relation = existing;

      networkCalls.push(this.adminService.updateArtrelation(existing));
    } else {
      const rel = new Artrelation();
      rel.fromcategory_id = this.categoryID;
      rel.tocategory_id = category.id;
      rel.weight = +inputValue;
      relation = rel;
      this.loadedRelations.push(rel);
      networkCalls.push(
        this.adminService
          .createArtrelation(rel.weight, rel.fromcategory_id, rel.tocategory_id)
          .pipe(
            tap((savedRelation) => {
              rel.id = savedRelation.id;
            }),
          ),
      );
    }

    for (const subcat of category.subcategories) {
      this.onCategoryRelationChange(subcat, inputValue);
    }

    forkJoin(networkCalls).subscribe(() => {
      this.snackBar.open('Saved!', null, {
        duration: 1000,
      });
    });
  }

  relationForCategory(categoryID: number) {
    const relation = this.loadedRelations.find((model) => {
      return model.tocategory_id === categoryID;
    });

    if (relation) {
      return relation.weight;
    }

    return null;
  }
}
