import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowBackBtnComponent } from './arrow-back-btn.component';

describe('ArrowBackBtnComponent', () => {
  let component: ArrowBackBtnComponent;
  let fixture: ComponentFixture<ArrowBackBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowBackBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArrowBackBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
