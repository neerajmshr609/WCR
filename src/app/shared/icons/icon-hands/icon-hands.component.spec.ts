import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHandsComponent } from './icon-hands.component';

describe('IconHandsComponent', () => {
  let component: IconHandsComponent;
  let fixture: ComponentFixture<IconHandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconHandsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconHandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
