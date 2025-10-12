import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import Flickity from 'flickity/dist/flickity.pkgd.js';
import { ProjectService } from 'src/app/services/project.service';
import { PQACollection } from 'src/app/shared/models/PQACollection.model';
import { Project } from 'src/app/shared/models/project.model';
import { Projectfile } from 'src/app/shared/models/projectfile.model';

@Component({
  selector: 'app-pqa-card',
  templateUrl: './pqa-card.component.html',
  styleUrls: ['./pqa-card.component.scss'],
})
export class PqaCardComponent implements OnInit {
  @ViewChild('pqaSliderRef') pqaSliderRef: ElementRef<HTMLElement>;
  @ViewChild('sliderRef') sliderRef: ElementRef<HTMLElement>;
  @ViewChild('cardRef') cardRef: ElementRef<HTMLElement>;

  @Input() PQACard: PQACollection;

  isSingleFileProject = false;
  horizontalSlider: Flickity;

  project: Project;
  selectedDisplayType = 'grid';
  selectedFile: Projectfile;

  maxHeight: number;

  constructor(
    private projectService: ProjectService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.projectService
      .fetchProject(this.PQACard.project_id)
      .subscribe((res) => {
        this.project = res;

        this.cdRef.detectChanges();

        this.isSingleFileProject = this.project.projectfiles.length === 1;
        this.initSliders();
      });
  }

  private initSliders() {
    this.horizontalSlider = new Flickity(this.pqaSliderRef.nativeElement, {
      setGallerySize: false,
      selectedAttraction: 0.25,
      friction: 0.8,
      contain: true,
      draggable: true,
      pageDots: true,
      prevNextButtons: true,
    });

    setTimeout(() => {
      this.maxHeight =
        this.cardRef.nativeElement.clientHeight -
        this.pqaSliderRef.nativeElement.offsetTop -
        110;
    });
  }
}
