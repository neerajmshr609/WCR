import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-aim-icon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: 100%;

      & * {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
      }
    }
  `,
  template: `
    <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M21.4189 10.6046C27.2793 10.6046 32.0299 15.3552 32.0299 21.2156C32.0299 27.076 27.2793 31.8266 21.4189 31.8266C15.5591 31.8266 10.8084 27.076 10.8084 21.2156C10.8084 15.3552 15.5591 10.6046 21.4189 10.6046ZM22.4498 0.775635V4.16151C31.0675 4.67053 37.9573 11.5623 38.473 20.1852H41.8594V22.246H38.4745C37.9655 30.8627 31.0717 37.7539 22.4498 38.2696V41.6555H20.389V38.2707C11.7719 37.7617 4.88108 30.8683 4.36537 22.246H0.979492V20.1852H4.36486C4.87542 11.5664 11.7652 4.67877 20.389 4.16203V0.775635H22.4498ZM22.4498 8.02034V10.0075C21.7626 9.94512 21.0763 9.94563 20.389 10.0075V8.02137C13.8996 8.52214 8.72446 13.7025 8.22368 20.1852H10.2113C10.15 20.8725 10.149 21.5587 10.2113 22.246H8.22368C8.72446 28.7354 13.9063 33.91 20.389 34.4108V32.4237C21.0763 32.4855 21.7626 32.486 22.4498 32.4237V34.4108C28.9382 33.9111 34.1139 28.7272 34.6147 22.246H32.627C32.6894 21.5587 32.6884 20.8725 32.627 20.1852H34.6147C34.1139 13.6958 28.9326 8.52111 22.4498 8.02034Z"
        [attr.fill]="color()"
      />
    </svg>
  `,
})
export class AimIconComponent extends BaseIconDirective {
  readonly color = input('#FFFFFF');
}
