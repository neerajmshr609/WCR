import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-share-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './share-icon.component.html',
  styleUrl: './share-icon.component.scss',
})
export class ShareIconComponent extends BaseIconDirective {}
