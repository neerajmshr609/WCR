import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendOrShareProfileComponent } from './recomend-or-share-profile.component';

describe('RecomendOrShareProfileComponent', () => {
  let component: RecomendOrShareProfileComponent;
  let fixture: ComponentFixture<RecomendOrShareProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecomendOrShareProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomendOrShareProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
