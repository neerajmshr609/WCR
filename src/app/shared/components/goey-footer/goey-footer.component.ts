import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as paper from 'paper';
import { ResizeService } from '../../../services/resize.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-goey-footer',
  templateUrl: './goey-footer.component.html',
  styleUrls: ['./goey-footer.component.scss'],
})
export class GoeyFooterComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  private isDesktop = toSignal(this.resizeService.isDesktop$);

  constructor(private resizeService: ResizeService) {}
  changeIconToHover(event: Event): void {
    const target = event.target as HTMLImageElement;
    const hoverSrc = target.getAttribute('data-hover');
    if (hoverSrc) {
      target.setAttribute('data-default', target.src); // Store the initial image source
      target.src = hoverSrc; // Change the image source to the hover image
    }
  }

  changeIconToDefault(event: Event): void {
    const target = event.target as HTMLImageElement;
    const defaultSrc = target.getAttribute('data-default');
    if (defaultSrc) {
      target.src = defaultSrc; // Revert the image source to the default image
    }
  }

  footerAnimation(): void {
    if (!this.canvas.nativeElement) {
      console.error('Canvas element not found!');
      return;
    }

    paper.setup(this.canvas.nativeElement);

    // Getting the view
    const view = paper.project.view;

    // The fun part
    const paths = new paper.Group();

    const addPoints = (path: paper.Path, quantity: number) => {
      // Opening point
      path.add(view.bounds.bottomLeft);

      // Middle points
      for (let i = -1; i <= quantity + 1; i++) {
        const x = (view.viewSize.width / quantity) * i;
        const y = view.viewSize.height / 2.618;
        path.add(new paper.Point(x, y));
      }

      // Closing point
      path.add(view.bounds.bottomRight);
    };

    const addPath = (quantity: number, color: string, opacity: number) => {
      const path = new paper.Path();
      path.fillColor = new paper.Color(color);
      path.opacity = opacity;

      addPoints(path, quantity);
      path.smooth();

      return path;
    };

    const animatePath = (path: paper.Path, event: any, index: number) => {
      const value1 = this.isDesktop() ? 16 : 10;
      const value2 = this.isDesktop() ? 48 : 42;
      const heightValue = this.isDesktop() ? 2.618 : 4;
      const multy = this.isDesktop() ? 0.8 : 1.2;
      path.segments.forEach((segment, i) => {
        if (i > 0 && i < path.segments.length - 1) {
          const sin = Math.sin(event.time * multy + i - index);
          segment.point.y =
            sin * value1 + view.viewSize.height / heightValue + index * value2;
        }
      });
      path.smooth();
    };

    // Creating paths
    let n = 1;
    let opacity = 0.1 / (n / 1);
    for (let i = 1; i <= n; i++) {
      const path = addPath(
        this.isDesktop() ? 36 : 26 - i,
        '#99999',
        i * opacity,
      );
      path.position.y += 125 * i;
      paths.addChild(path);
    }

    n = 2;
    opacity = 1 / (n / 2);
    for (let i = 1; i <= n; i++) {
      const path = addPath(
        (this.isDesktop() ? 22 : 14) - i,
        '#D0D0D0',
        i * opacity,
      );
      path.position.y += (this.isDesktop() ? 125 : 195) * i;
      paths.addChild(path);
    }

    // View events
    view.onFrame = (event: any) => {
      paths.children.forEach((path, i) => {
        animatePath(path as paper.Path, event, i);
      });
    };
  }

  ngAfterViewInit(): void {
    this.footerAnimation();
  }
}
