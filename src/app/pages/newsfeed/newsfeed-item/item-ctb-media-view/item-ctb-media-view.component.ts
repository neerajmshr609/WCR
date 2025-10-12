import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Project } from 'src/app/shared/models/project.model';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import { RateflowService } from 'src/app/services/rateflow.service';

@Component({
  selector: 'app-item-ctb-media-view',
  templateUrl: './item-ctb-media-view.component.html',
  styleUrls: ['./item-ctb-media-view.component.scss'],
})
export class ItemCtbMediaViewComponent extends BaseComponent implements OnInit {
  @Input() files: Projectfile[];
  @Input() readonly = false;
  @Input() projects: Project[];

  @Output() didSelectFile = new EventEmitter<void>();

  selectedFile: Projectfile;
  title: string;

  constructor(
    public rateflowService: RateflowService,
    private newsfeedService: NewsfeedService,
  ) {
    super();
  }

  ngOnInit() {
    this.title = this.projects?.find(
      (project) => project.id === this.files[0].project_id,
    ).title;
  }

  isWinnerFile(file: Projectfile) {
    let isWinner = false;

    this.files.forEach((fl) => {
      if (fl.likecount < file.likecount) {
        isWinner = true;
      }
    });

    return isWinner;
  }

  percentForFile(file: Projectfile) {
    const totalCount = this.files.reduce(
      (prev, cur) => prev + cur.likecount,
      0,
    );

    const countForTag = file.likecount;
    if (totalCount === 0) {
      return 0 + '%';
    }

    const percent = (countForTag * 100) / totalCount;

    return Math.ceil(percent) + '%';
  }

  fileDidTap(file: Projectfile) {
    if (this.selectedFile) {
      return;
    }

    this.didSelectFile.emit();

    this.selectedFile = file;
    this.selectedFile.likecount += 1;
    this.newsfeedService
      .saveFileLike(file)
      .pipe(takeUntil(this.destroyed))
      .subscribe();
  }
}
