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
import { MatDialog } from '@angular/material/dialog';
import { getRandomInt } from '../../functions/get-random-int';
import { Projectfile } from '../../models/projectfile.model';
import { BaseComponent } from '../base.component';
import { DummyHowToUseComponent } from './dummy-how-to-use/dummy-how-to-use.component';

@Component({
  selector: 'app-dummy-file',
  templateUrl: './dummy-file.component.html',
  styleUrls: ['./dummy-file.component.scss'],
})
export class DummyFileComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('dummyThumbRef') dummyThumbRef: ElementRef;
  @ViewChild('tabsRef') tabsRef: ElementRef;
  @ViewChild('explainerRef') explainerRef: ElementRef;

  @Input() public file: Projectfile;
  @Input() public isRateflowPresentation: boolean;

  public thumbSrc: string;

  public tabs = [];
  public activeTab: string;

  public imgHeight: number;
  public tabsWidth: string;

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setTabs();
    this.getThumb();
  }

  ngAfterViewInit() {
    this.setHeight();
  }

  private setTabs() {
    this.tabs.push({ displayName: 'dummy_file.overview', name: 'title' });

    if (this.file.filedescription) {
      this.tabs.push({
        displayName: 'dummy_file.description',
        name: 'description',
      });
    }

    this.tabClick('title');
  }

  private getThumb() {
    this.thumbSrc = this.file.thumbnail || this.getRandomThumb();
  }

  private getRandomThumb(): string {
    const int = getRandomInt(0, 6);
    return '/assets/default-thumbnails/dummy/' + int + '.png';
  }

  public tabClick(tab: string) {
    this.activeTab = tab;
  }

  private setHeight() {
    this.imgHeight = this.dummyThumbRef?.nativeElement.clientWidth / (4 / 3);
    this.cdr.detectChanges();
  }

  public openHowToUse() {
    this.dialog.open(DummyHowToUseComponent, {
      autoFocus: false,
    });
  }

  @HostListener('window:resize') onResize() {
    this.setHeight();
  }
}
