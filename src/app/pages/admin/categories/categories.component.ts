import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from '../admin.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { Artfield } from 'src/app/shared/models/artfield.model';
import { Category } from 'src/app/shared/models/category.model';
import { Relation } from 'src/app/shared/models/relation.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories: Category[];
  parentCategories: Category[];
  selectedCategory: Category;
  selectedCategorySub = new BehaviorSubject<Category>(null);

  isCreating = false;
  isDeleting = false;

  relations: Relation[] = [];

  @ViewChild('categoryForm', { static: true }) categoryForm: NgForm;

  constructor(
    private adminService: AdminService,
    private projectService: ProjectService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.fetch();
  }

  sortCategoriesBy(prop: string) {
    if (!this.categories) {
      return [];
    }
    return this.categories.sort((a, b) =>
      a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1,
    );
  }

  onSelect(category: Category) {
    this.selectedCategory = category;
    this.selectedCategorySub.next(this.selectedCategory);
    if (this.selectedCategory.parentcategory_id) {
      this.categoryForm.setValue({
        name: this.selectedCategory.name,
        parentcategory_id: this.selectedCategory.parentcategory_id,
      });
    } else {
      this.categoryForm.setValue({
        name: this.selectedCategory.name,
        parentcategory_id: null,
      });
    }
  }

  onCreateRequest() {
    this.resetForm();
  }

  onDelete() {
    this.isDeleting = true;
    this.categoryForm.resetForm();

    this.adminService
      .deleteCategory(this.selectedCategory.id)
      .subscribe((result) => {
        this.selectedCategory = new Category('', '');
        this.isDeleting = false;
        this.resetForm();
        this.fetch();
      });
  }

  onParentRelationUpdate(relation: Relation) {
    this.relations.push(relation);
  }

  onRelationUpdate(relation: Relation) {
    this.relations.push(relation);
  }

  onSubmit(form: NgForm) {
    this.isCreating = true;
    const name = form.value.name;
    const parentcategory = form.value.parentcategory_id;
    const tag = name.replace(/\s+/g, '_').toLowerCase();
    const id = this.selectedCategory ? this.selectedCategory.id : null;

    const exists = this.categories.find(function (element: Artfield) {
      return element.id === id;
    });

    if (exists) {
      this.adminService
        .updateCategory(exists.id, name, tag, parentcategory)
        .subscribe((result) => {
          const networkCalls = [];
          for (const rel of this.relations) {
            const call = this.adminService.createRelation(
              rel.weight,
              rel.fromcategory_id,
              rel.tocategory_id,
              rel.fromparentcategory_id,
              rel.toparentcategory_id,
            );
            networkCalls.push(call);
          }

          if (networkCalls.length === 0) {
            this.resetForm();
            this.fetch();
            this.isCreating = false;
          } else {
            forkJoin(networkCalls).subscribe((relationsSaved) => {
              this.resetForm();
              this.fetch();
              this.isCreating = false;
            });
          }
        });
    } else {
      this.adminService
        .createCategory(name, tag, parentcategory)
        .subscribe((result) => {
          this.resetForm();
          this.fetch();
          this.isCreating = false;
        });
    }
  }

  private resetForm() {
    this.relations = [];
    this.categoryForm.resetForm();
    this.selectedCategory = null;
    setTimeout(() => {
      this.selectedCategory = new Category('', '');
      this.changeDetectorRef.detectChanges(); // Angular ChangeDetectorRef Service
    });
  }

  private fetch() {
    this.projectService.fetchCategories().subscribe((results) => {
      this.categories = results;
      this.adminService.fetchParentCategories().subscribe((parents) => {
        this.parentCategories = parents;
      });
    });
  }
}
