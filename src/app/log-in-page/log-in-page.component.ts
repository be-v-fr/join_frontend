import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { RouterModule } from '@angular/router';


/**
 * This component displays the log in/sign up page.
 * It is also the general landing page and includes the intro animation.
 */
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


  /**
   * Set animation with respect to required time
   */
  ngOnInit() {
    setTimeout(() => this.animate = false, 800);
  }


  /**
   * Toggle mode ('Log in'/'Sign up') of registration form component
   */
  toggleFormMode() {
    this.formMode == 'Log in' ? this.formMode = 'Sign up' : this.formMode = 'Log in';
  }
}
