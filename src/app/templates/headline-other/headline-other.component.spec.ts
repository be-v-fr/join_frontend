import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlineOtherComponent } from './headline-other.component';

describe('HeadlineOtherComponent', () => {
  let component: HeadlineOtherComponent;
  let fixture: ComponentFixture<HeadlineOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadlineOtherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeadlineOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
