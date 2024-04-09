import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonBadgeComponent } from './person-badge.component';

describe('PersonBadgeComponent', () => {
  let component: PersonBadgeComponent;
  let fixture: ComponentFixture<PersonBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonBadgeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
