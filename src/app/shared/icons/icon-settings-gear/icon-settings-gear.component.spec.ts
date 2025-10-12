import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSettingsGearComponent } from './icon-settings-gear.component';

describe('IconSettingsGearComponent', () => {
  let component: IconSettingsGearComponent;
  let fixture: ComponentFixture<IconSettingsGearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconSettingsGearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconSettingsGearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
