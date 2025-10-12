import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SponsorBoxComponent } from './sponsor-box.component';

describe('SponsorBoxComponent', () => {
  let component: SponsorBoxComponent;
  let fixture: ComponentFixture<SponsorBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponsorBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SponsorBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
