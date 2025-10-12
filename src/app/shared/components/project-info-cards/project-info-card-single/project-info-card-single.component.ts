import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ProjectInfoCardTypeEnum } from 'src/app/shared/enums';
import { ProjectInfoCard } from 'src/app/shared/models/ProjectInfoCard.model';

@Component({
  selector: 'app-project-info-card-single',
  templateUrl: './project-info-card-single.component.html',
  styleUrls: ['./project-info-card-single.component.scss'],
})
export class ProjectInfoCardSingleComponent implements OnInit, AfterViewInit {
  @ViewChild('cardRef') cardRef: ElementRef;

  @Input() public projectInfoCard: ProjectInfoCard;
  @Input() public isSmall: boolean;

  public cardTypes = ProjectInfoCardTypeEnum;
  public cardWidth: number;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.onResize();
  }

  @HostListener('window:resize') onResize() {
    if (window.innerWidth < 360) {
      this.cardWidth = window.innerWidth - 40;
    } else {
      this.cardWidth = this.cardRef.nativeElement.clientWidth;
    }
    this.cdr.detectChanges();
  }
}
