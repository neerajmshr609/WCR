import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { NgForm } from '@angular/forms';
import { Artfield } from 'src/app/shared/models/artfield.model';
import { Category } from 'src/app/shared/models/category.model';

@Component({
  selector: 'app-artfields',
  templateUrl: './artfields.component.html',
  styleUrls: ['./artfields.component.scss'],
})
export class ArtfieldsComponent implements OnInit {
  isCreating = false;
  isDeleting = false;
  artfields: Artfield[];
  parentCategories: Category[];
  selectedArtfield = new Artfield('', '');
  @ViewChild('artfieldForm', { static: true }) artfieldForm: NgForm;

  constructor(
    private adminService: AdminService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.__fetch();
  }

  onSelect(artfield: Artfield) {
    this.selectedArtfield = artfield;
    this.artfieldForm.setValue({ name: this.selectedArtfield.name });
  }

  onCreateRequest() {
    this.__resetForm();
  }

  onDelete() {
    this.isDeleting = true;
    this.artfieldForm.resetForm();

    this.adminService
      .deleteArtfield(this.selectedArtfield.id)
      .subscribe((result) => {
        this.selectedArtfield = new Artfield('', '');
        this.isDeleting = false;
        this.__resetForm();
        this.__fetch();
      });
  }
  didToggleParentCategory(categoryID: number) {
    const existing = this.selectedArtfield.parentcategories.find(function (
      element: number,
    ) {
      return element === categoryID;
    });

    if (!existing) {
      this.selectedArtfield.parentcategories.push(categoryID);
    } else {
      this.selectedArtfield.parentcategories =
        this.selectedArtfield.parentcategories.filter((fl) => {
          return fl !== categoryID;
        });
    }
  }

  onSubmit(form: NgForm) {
    this.isCreating = true;
    const name = form.value.name;
    const tag = name.replace(/\s+/g, '_').toLowerCase();
    const id = this.selectedArtfield ? this.selectedArtfield.id : null;

    const exists = this.artfields.find(function (element: Artfield) {
      return element.id === id;
    });

    if (exists) {
      this.adminService
        .updateArtfield(
          exists.id,
          name,
          tag,
          this.selectedArtfield.parentcategories,
        )
        .subscribe((result) => {
          this.__resetForm();
          this.__fetch();
          this.isCreating = false;
        });
    } else {
      this.adminService.createArtfield(name, tag).subscribe((result) => {
        this.__resetForm();
        this.__fetch();
        this.isCreating = false;
      });
    }
  }

  private __resetForm() {
    this.artfieldForm.resetForm();
    this.selectedArtfield = null;
    setTimeout(() => {
      this.selectedArtfield = new Artfield('', '');
      this.changeDetectorRef.detectChanges(); // Angular ChangeDetectorRef Service
    });
  }

  private __fetch() {
    this.adminService.fetchArtfields().subscribe((results) => {
      this.artfields = results;
      this.adminService.fetchParentCategories().subscribe((result) => {
        this.parentCategories = result;
      });
    });
  }
}
