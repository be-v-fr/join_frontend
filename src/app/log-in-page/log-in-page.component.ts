import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-log-in-page',
  standalone: true,
  imports: [CommonModule, RegistrationFormComponent, RouterModule],
  templateUrl: './log-in-page.component.html',
  styleUrl: './log-in-page.component.scss'
})
export class LogInPageComponent implements OnInit {
  animate: boolean = true;
  formMode: 'Log in' | 'Sign up' = 'Log in';

  ngOnInit() {
    setTimeout(() => this.animate = false, 800);
  }

  toggleFormMode() {
    this.formMode == 'Log in' ? this.formMode = 'Sign up' : this.formMode = 'Log in';
  }
}
