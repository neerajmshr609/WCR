import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from '../admin.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { Artfield } from 'src/app/shared/models/artfield.model';
import { Category } from 'src/app/shared/models/category.model';
import { Relation } from 'src/app/shared/models/relation.model';

@Component({
  selector: 'app-parentcategories',
  templateUrl: './parentcategories.component.html',
  styleUrls: ['./parentcategories.component.scss'],
})
export class ParentcategoriesComponent implements OnInit {
  artfields: Artfield[];
  isCreating = false;
  isDeleting = false;
  selectedCategory = new Category('', '');
  selectedCategorySub = new BehaviorSubject<Category>(null);

  parentCategories: Category[];
  childCategories: Category[];
  filteredChildCategories: Category[];

  relations: Relation[] = [];

  @ViewChild('categoryForm', { static: true }) categoryForm: NgForm;
  constructor(
    private adminService: AdminService,
    private projectService: ProjectService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.__fetch();
    this.adminService.fetchArtfields().subscribe((results) => {
      this.artfields = results;
    });
  }

  sortPatentCategoriesBy(prop: string) {
    if (!this.parentCategories) {
      return [];
    }
    return this.parentCategories.sort((a, b) =>
      a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1,
    );
  }

  onSelect(category: Category) {
    this.selectedCategory = category;
    this.filteredChildCategories = this.childCategories.filter((object) => {
      return object.parentcategory_id === this.selectedCategory.id;
    });
    this.selectedCategorySub.next(this.selectedCategory);
    if (this.selectedCategory.artfield_id) {
      this.categoryForm.setValue({
        name: this.selectedCategory.name,
        artfield_id: this.selectedCategory.artfield_id,
      });
    } else {
      this.categoryForm.setValue({
        name: this.selectedCategory.name,
        artfield_id: null,
      });
    }
  }

  onCreateRequest() {
    this.__resetForm();
  }

  onDelete() {
    this.isDeleting = true;
    this.categoryForm.resetForm();

    this.adminService
      .deleteParentCategory(this.selectedCategory.id)
      .subscribe((result) => {
        this.selectedCategory = new Category('', '');
        this.isDeleting = false;
        this.__resetForm();
        this.__fetch();
      });
  }

  didToggleParentCategory(childCategoryID: number) {
    const existing = this.selectedCategory.categories.find(function (
      element: number,
    ) {
      return element === childCategoryID;
    });

    if (!existing) {
      this.selectedCategory.categories.push(childCategoryID);
    } else {
      this.selectedCategory.categories =
        this.selectedCategory.categories.filter((fl) => {
          return fl !== childCategoryID;
        });
    }
  }

  onSubmit(form: NgForm) {
    this.isCreating = true;
    const name = form.value.name;
    const artfield = form.value.artfield_id;
    const tag = name.replace(/\s+/g, '_').toLowerCase();
    const id = this.selectedCategory ? this.selectedCategory.id : null;

    const exists = this.parentCategories.find(function (element: Artfield) {
      return element.id === id;
    });

    if (exists) {
      this.adminService
        .updateParentCategory(
          exists.id,
          name,
          tag,
          artfield,
          this.selectedCategory.categories,
        )
        .subscribe((result) => {
          debugger;
          const networkCalls = [];
          // this.relations = this.__unique2(this.relations, 'tocategory_id');
          for (const rel of this.relations) {
            if (rel.id) {
              const call = this.adminService.updateRelation(rel);
              networkCalls.push(call);
            } else {
              const call = this.adminService.createRelation(
                rel.weight,
                rel.fromcategory_id,
                rel.tocategory_id,
                rel.fromparentcategory_id,
                rel.toparentcategory_id,
              );
              networkCalls.push(call);
            }
          }

          if (networkCalls.length === 0) {
            this.__resetForm();
            this.__fetch();
            this.isCreating = false;
          } else {
            forkJoin(networkCalls).subscribe((relationsSaved) => {
              this.__resetForm();
              this.__fetch();
              this.isCreating = false;
            });
          }
        });
    } else {
      this.adminService
        .createParentCategory(
          name,
          tag,
          artfield,
          this.selectedCategory.categories,
        )
        .subscribe((result) => {
          this.__resetForm();
          this.__fetch();
          this.isCreating = false;
        });
    }
  }

  onParentRelationUpdate(relation: Relation) {
    const existing = this.relations.find((obj) => {
      return obj.toparentcategory_id === relation.toparentcategory_id;
    });

    if (existing) {
      existing.weight = relation.weight;
    } else {
      this.relations.push(relation);
    }
  }

  onRelationUpdate(relation: Relation) {
    const existing = this.relations.find((obj) => {
      return obj.tocategory_id === relation.tocategory_id;
    });

    if (existing) {
      existing.weight = relation.weight;
    } else {
      this.relations.push(relation);
    }
  }

  private __resetForm() {
    this.relations = [];
    this.categoryForm.resetForm();
    this.selectedCategory = null;
    setTimeout(() => {
      this.selectedCategory = new Category('', '');
      this.changeDetectorRef.detectChanges(); // Angular ChangeDetectorRef Service
    });
  }

  private __fetch() {
    this.adminService.fetchParentCategories().subscribe((results) => {
      this.parentCategories = results;
      this.projectService.fetchCategories().subscribe((childCategories) => {
        this.childCategories = childCategories;
        this.filteredChildCategories = this.childCategories;
      });
    });
  }
}
