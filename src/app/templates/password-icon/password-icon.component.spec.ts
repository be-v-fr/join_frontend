import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordIconComponent } from './password-icon.component';

describe('PasswordIconComponent', () => {
  let component: PasswordIconComponent;
  let fixture: ComponentFixture<PasswordIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
