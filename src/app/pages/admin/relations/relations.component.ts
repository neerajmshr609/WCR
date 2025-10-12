import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminService } from '../admin.service';
import { BehaviorSubject } from 'rxjs';
import { Category } from 'src/app/shared/models/category.model';
import { Artfield } from 'src/app/shared/models/artfield.model';
import { Relation } from 'src/app/shared/models/relation.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.scss'],
})
export class RelationsComponent implements OnInit {
  isSubgenreMode = false;
  isLoading = false;
  currentCategory: Category;
  artfields: Artfield[];
  parentCategories: Category[];
  categories: Category[];
  loadedRelations: Relation[];
  @Input() currentCategorySub: BehaviorSubject<Category>;
  @Output() parentCategoryrelationUpdate = new EventEmitter<Relation>();
  @Output() categoryrelationUpdate = new EventEmitter<{}>();
  @Output() artfieldUpdate = new EventEmitter<{}>();

  constructor(
    private adminService: AdminService,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {
    this.currentCategorySub.subscribe((category) => {
      this.isLoading = true;

      this.projectService.fetchCategories().subscribe((results) => {
        this.categories = results;
        this.adminService.fetchParentCategories().subscribe((parents) => {
          this.parentCategories = parents;

          this.adminService.fetchArtfields().subscribe((artfields) => {
            this.artfields = artfields;

            this.__loadRelations(category);
          });
        });
      });
    });
  }

  private __loadRelations(category: Category) {
    this.currentCategory = category;

    if (category.artfield_id) {
      this.isSubgenreMode = false;
      this.adminService
        .fetchParentCategoryRelations(category.id)
        .subscribe((relations) => {
          this.loadedRelations = relations;
          this.isLoading = false;
        });
    } else {
      this.isSubgenreMode = true;
      // this.adminService.fetchRelations(category.id).subscribe( relations => {
      //   this.loadedRelations = relations;
      //
      //   this.isLoading = false;
      // });
    }
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

  onArtfieldChange(artfieldID: number, inputValue: number) {
    const artfieldParentCategories = this.parentCategories.filter(
      (parentCat) => {
        return parentCat.artfield_id === artfieldID;
      },
    );

    for (const cat of artfieldParentCategories) {
      this.onParentCategoryRelationChange(cat.id, inputValue);

      const relation = this.loadedRelations.find((model) => {
        return model.toparentcategory_id === cat.id;
      });

      if (relation) {
        relation.weight = inputValue;
      } else {
        const rel = new Relation();

        if (this.currentCategory.artfield_id) {
          rel.fromparentcategory_id = this.currentCategory.id;
        } else {
          rel.fromcategory_id = this.currentCategory.id;
        }

        rel.toparentcategory_id = cat.id;
        rel.weight = inputValue;
        this.loadedRelations.push(rel);
      }

      for (const subcat of this.categories) {
        if (subcat.parentcategory_id === cat.id) {
          this.onCategoryRelationChange(subcat.id, inputValue);

          const subcatRelation = this.loadedRelations.find((model) => {
            return model.tocategory_id === subcat.id;
          });

          if (subcatRelation) {
            subcatRelation.weight = inputValue;
          } else {
            const rel = new Relation();
            if (this.currentCategory.artfield_id) {
              rel.fromparentcategory_id = this.currentCategory.id;
            } else {
              rel.fromcategory_id = this.currentCategory.id;
            }
            rel.tocategory_id = subcat.id;
            rel.weight = inputValue;
            this.loadedRelations.push(rel);
          }
        }
      }
    }
  }

  valueForArtfield(artfieldID: number) {
    // const artfieldCategoriesRelations = this.loadedRelations.filter(model => {
    //
    //   return model.artfield_id === artfieldID;
    // }).map(relation => {
    //   return relation.weight;
    // });
    // debugger;
    // return  artfieldCategoriesRelations.reduce(function(p,c,i,a){return p + (c/a.length)},0);
  }

  relationForParentCategory(parentCategoryID: number) {
    const relation = this.loadedRelations.find((model) => {
      return model.toparentcategory_id === parentCategoryID;
    });

    if (relation) {
      return relation.weight;
    }

    return null;
  }

  onParentCategoryRelationChange(categoryID: number, inputValue: number) {
    let relation: Relation;

    if (this.isSubgenreMode) {
      const existing = this.loadedRelations.find((element) => {
        return (
          element.toparentcategory_id === categoryID &&
          element.fromcategory_id === this.currentCategory.id
        );
      });

      if (existing) {
        existing.weight = +inputValue;
        relation = existing;
      } else {
        const rel = new Relation();
        rel.fromcategory_id = this.currentCategory.id;
        rel.toparentcategory_id = categoryID;
        rel.weight = +inputValue;
        relation = rel;
      }
    } else {
      const existing = this.loadedRelations.find((element) => {
        return (
          element.toparentcategory_id === categoryID &&
          element.fromparentcategory_id === this.currentCategory.id
        );
      });

      if (existing) {
        existing.weight = +inputValue;
        relation = existing;
      } else {
        const rel = new Relation();
        rel.fromparentcategory_id = this.currentCategory.id;
        rel.toparentcategory_id = categoryID;
        rel.weight = +inputValue;
        relation = rel;
      }
    }

    this.parentCategoryrelationUpdate.emit(relation);

    for (const subcat of this.categories) {
      if (subcat.parentcategory_id === categoryID) {
        this.onCategoryRelationChange(subcat.id, inputValue);

        const subcatRelation = this.loadedRelations.find((model) => {
          return model.tocategory_id === subcat.id;
        });

        if (subcatRelation) {
          subcatRelation.weight = inputValue;
        } else {
          const rel = new Relation();
          if (this.currentCategory.artfield_id) {
            rel.fromparentcategory_id = this.currentCategory.id;
          } else {
            rel.fromcategory_id = this.currentCategory.id;
          }
          rel.tocategory_id = subcat.id;
          rel.weight = inputValue;
          this.loadedRelations.push(rel);
        }
      }
    }
  }

  onCategoryRelationChange(categoryID: number, inputValue: number) {
    let relation: Relation;
    if (this.isSubgenreMode) {
      const existing = this.loadedRelations.find((element) => {
        return (
          element.tocategory_id === categoryID &&
          element.fromcategory_id === this.currentCategory.id
        );
      });

      if (existing) {
        existing.weight = +inputValue;
        relation = existing;
      } else {
        const rel = new Relation();
        rel.fromcategory_id = this.currentCategory.id;
        rel.tocategory_id = categoryID;
        rel.weight = +inputValue;
        relation = rel;
      }
    } else {
      const existing = this.loadedRelations.find((element) => {
        return (
          element.tocategory_id === categoryID &&
          element.fromparentcategory_id === this.currentCategory.id
        );
      });

      if (existing) {
        existing.weight = +inputValue;
        relation = existing;
      } else {
        const rel = new Relation();
        rel.fromparentcategory_id = this.currentCategory.id;
        rel.tocategory_id = categoryID;
        rel.weight = +inputValue;
        relation = rel;
      }
    }

    this.categoryrelationUpdate.emit(relation);
  }
}
