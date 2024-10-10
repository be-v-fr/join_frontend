import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { RouterModule } from '@angular/router';


/**
 * @component
 * This component represents the log in/sign up page, which serves as the general landing page. 
 * It includes the intro animation and manages the login and registration modes.
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
   * Lifecycle hook that initializes the component.
   * It disables the intro animation after 800 milliseconds.
   */
  ngOnInit() {
    setTimeout(() => this.animate = false, 800);
  }


  /**
   * Toggles the form mode between 'Log in' and 'Sign up' in the registration form component.
   */
  toggleFormMode() {
    this.formMode == 'Log in' ? this.formMode = 'Sign up' : this.formMode = 'Log in';
  }
}
