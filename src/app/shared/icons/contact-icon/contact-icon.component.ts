import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-contact-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-icon.component.html',
  styleUrl: './contact-icon.component.scss',
})
export class ContactIconComponent extends BaseIconDirective {}
