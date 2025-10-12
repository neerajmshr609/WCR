import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconChevronsUpComponent } from './icon-chevrons-up.component';

describe('IconChevronsUpComponent', () => {
  let component: IconChevronsUpComponent;
  let fixture: ComponentFixture<IconChevronsUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconChevronsUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconChevronsUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
