import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { Resortimage } from 'src/app/shared/models/Resortimage.model';
import { InsightsService } from 'src/app/services/insights.service';

@Component({
  selector: 'app-item-resort-view',
  templateUrl: './item-resort-view.component.html',
  styleUrls: ['./item-resort-view.component.scss'],
})
export class ItemResortViewComponent extends BaseComponent implements OnInit {
  @Input() raterID: number;
  @Input() project;

  originalFiles: Projectfile[];
  resortedFiles: Projectfile[] = [];
  galleryItems: Projectfile[];
  isResorted = true;

  constructor(private insightsService: InsightsService) {
    super();
  }

  ngOnInit() {
    const id = this.project.project_id || this.project.id;

    if (!id) {
      return;
    }

    this.insightsService
      .fetchProjectResort(id, this.raterID)
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        this.project = res[0].project;
        const rImgs: Resortimage[] = res[0].resortimages;

        rImgs.map((obj, index) => {
          const oldObj = this.project.projectfiles.find(
            (file) => +file.id === obj.projectfile_id,
          );
          const fl = { ...oldObj, order: index, old_order: obj.order };
          this.resortedFiles.push(fl);
        });

        this.originalFiles = this.project.projectfiles;
        this.didSelectResort();
      });
  }

  didToggleResort() {
    if (this.isResorted) {
      this.didSelectOriginal();
    } else {
      this.didSelectResort();
    }
  }

  didSelectResort() {
    this.isResorted = true;
    this.galleryItems = this.resortedFiles;
  }

  didSelectOriginal() {
    this.isResorted = false;
    this.galleryItems = this.originalFiles;
  }
}
