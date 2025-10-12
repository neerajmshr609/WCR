import { Component, Inject } from '@angular/core';
import { CONTAINER_DATA } from 'src/app/services/injector.service';

@Component({
  selector: 'app-file-preview-overlay',
  template: `
    <img class="overlay-image" src="assets/loader-white.svg" />
    <div class="overlay-description-container">
      <h1 class="overlay-title"></h1>
      <p class="overlay-desc"></p>
    </div>
    <img class="close-button" src="assets/newsfeed/x-circle.svg" alt="" />
  `,
  styles: [
    `
      :host {
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        justify-content: flex-end;
      }

      .overlay-description-container {
        background-color: white;
        padding: 2rem;
        width: 100%;
      }

      .close-button {
        position: absolute;
        top: 2rem;
        right: 2rem;
        cursor: pointer;
        width: 24px;
        height: 24px;
        background-color: transparent;
        filter: invert(1);
        z-index: 10;
        opacity: 0.5;
      }

      .overlay-title {
        font-size: 2.2rem;
        font-weight: 500;
        margin-top: 0.7rem;
        display: block;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 2rem;
        margin-bottom: 1.4rem;
        font-family: 'Poppins', sans-serif;
      }

      .overlay-desc {
        font-size: 1.4rem;
        margin-bottom: 1.4rem;
        font-weight: 400;
      }

      img {
        height: 100%;
        width: 100%;
        object-fit: contain;
        margin: 0 auto;
        background-color: black;
      }
    `,
  ],
})
export class FilePreviewOverlayComponent {
  constructor(@Inject(CONTAINER_DATA) public componentData: any) {}
}
