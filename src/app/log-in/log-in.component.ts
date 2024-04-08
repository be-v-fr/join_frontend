import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RegistrationFormComponent } from './registration-form/registration-form.component';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, RegistrationFormComponent],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent implements OnInit {
  animate: boolean = true;
  formMode: 'Log in' | 'Sign up' = 'Log in';

  ngOnInit() {
    setTimeout(() => this.animate = false, 800);
  }

  toggleFormMode() {
    this.formMode == 'Log in' ? this.formMode = 'Sign up' : this.formMode = 'Log in';
  }
}
