import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconShareSecondComponent } from './icon-share-second.component';

describe('IconShareSecondComponent', () => {
  let component: IconShareSecondComponent;
  let fixture: ComponentFixture<IconShareSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconShareSecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconShareSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
