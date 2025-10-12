import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHandsPeopleEarthComponent } from './icon-hands-people-earth.component';

describe('IconHandsPeopleEarthComponent', () => {
  let component: IconHandsPeopleEarthComponent;
  let fixture: ComponentFixture<IconHandsPeopleEarthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconHandsPeopleEarthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconHandsPeopleEarthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
