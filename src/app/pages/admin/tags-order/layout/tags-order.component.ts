import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Artcategory } from 'src/app/shared/models/artcategory.model';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-tags-order',
  templateUrl: './tags-order.component.html',
  styleUrls: ['./tags-order.component.scss'],
})
export class TagsOrderComponent implements OnInit {
  isLoading: boolean;
  tags: Artcategory[];
  subscription: Subscription;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.fetchFlatArtcategories('bound_to_skill').subscribe(() => {
      this.tags = this.adminService.artCategories$.value;
      this.tags.sort((a, b) => a.order - b.order);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tags, event.previousIndex, event.currentIndex);
    this.updateTags();
  }

  updateTags() {
    this.subscription?.unsubscribe();

    const tags = this.tags
      .map((tag, order) => {
        if (tag.order !== order) {
          tag.order = order;
          return tag;
        }
      })
      .filter((tag) => tag);

    if (!tags.length) {
      return;
    }
    this.subscription = this.adminService
      .bulkUpdateArtcategories(tags)
      .subscribe();
  }

  deactivate(index: number) {
    const tag = this.tags[index];
    this.adminService
      .bulkUpdateArtcategories([{ ...tag, is_active: false }])
      .subscribe(() => {
        this.updateTags();
        tag.is_active = false;
      });
  }

  activate(index: number) {
    const tag = this.tags[index];
    this.adminService
      .bulkUpdateArtcategories([{ ...tag, is_active: true }])
      .subscribe(() => {
        this.updateTags();
        tag.is_active = true;
      });
  }
}
