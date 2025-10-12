import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconRenderComponent } from './icon-render.component';

describe('IconRenderComponent', () => {
  let component: IconRenderComponent;
  let fixture: ComponentFixture<IconRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconRenderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
