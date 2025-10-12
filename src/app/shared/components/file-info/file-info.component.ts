import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Projectfile } from '../../models/projectfile.model';

@Component({
  selector: 'app-file-info',
  templateUrl: './file-info.component.html',
  styleUrls: ['./file-info.component.scss'],
})
export class FileInfoComponent implements OnInit, OnChanges {
  @Input() public file: Projectfile;
  @Input() public showPopup: boolean;
  @Output() public toggle = new EventEmitter<void>();

  public tabs = [];
  public activeTab: string;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.file?.currentValue &&
      changes.file.currentValue !== changes.file.previousValue
    ) {
      this.setTabs();
    }
  }

  private setTabs() {
    this.tabs = [];

    if (this.file.lyrics) {
      this.tabs.push({ displayName: 'file_info.lyrics', name: 'lyrics' });
    }

    this.tabs.push({
      displayName: 'file_info.description',
      name: 'description',
    });
    this.activeTab = this.file.lyrics ? 'lyrics' : 'description';
  }

  public tabClick(tab: string) {
    this.activeTab = tab;
  }
}
