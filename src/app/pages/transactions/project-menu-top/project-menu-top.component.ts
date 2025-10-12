import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MenuItemObject } from 'src/app/shared/models/common-interface';

@Component({
  selector: 'app-project-menu-top',
  templateUrl: './project-menu-top.component.html',
  styleUrls: ['./project-menu-top.component.scss'],
})
export class ProjectMenuTopComponent implements OnInit, OnDestroy {
  @Output() activatedUserInfoItem = new EventEmitter<MenuItemObject>();
  @Output() activatedItem = new EventEmitter<MenuItemObject>();

  @Input() topMenuType: string;
  @Input() menuItems: MenuItemObject[];

  activeItem: MenuItemObject;

  constructor() {}

  ngOnInit() {
    this.activeItem = this.menuItems[0];
  }

  selectItem(index: number) {
    if (index > 0) {
      this.activeItem = this.menuItems[index];
    }
  }

  onNext() {
    if (this.activeItem === this.menuItems[this.menuItems.length - 1]) {
      return;
    }

    const currentIndex = this.menuItems.indexOf(this.activeItem);
    this.activeItem = this.menuItems[currentIndex + 1];

    this.activatedItem.emit(this.activeItem.object);
  }

  onPrev() {
    if (this.activeItem === this.menuItems[0]) {
      return;
    }

    const currentIndex = this.menuItems.indexOf(this.activeItem);
    this.activeItem = this.menuItems[currentIndex - 1];

    this.activatedItem.emit(this.activeItem.object);
  }

  ngOnDestroy(): void {}
}
