import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframePresentationComponent } from './iframe-presentation.component';

describe('IframePresentationComponent', () => {
  let component: IframePresentationComponent;
  let fixture: ComponentFixture<IframePresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IframePresentationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IframePresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
