import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconOrgChatComponent } from './icon-org-chat.component';

describe('IconOrgChatComponent', () => {
  let component: IconOrgChatComponent;
  let fixture: ComponentFixture<IconOrgChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconOrgChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconOrgChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
