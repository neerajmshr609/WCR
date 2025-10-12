import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-scanner-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scanner-icon.component.html',
  styleUrl: './scanner-icon.component.scss',
})
export class ScannerIconComponent extends BaseIconDirective {}
