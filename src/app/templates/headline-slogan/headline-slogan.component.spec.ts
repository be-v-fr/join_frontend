import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlineSloganComponent } from './headline-slogan.component';

describe('HeadlineSloganComponent', () => {
  let component: HeadlineSloganComponent;
  let fixture: ComponentFixture<HeadlineSloganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadlineSloganComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeadlineSloganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
