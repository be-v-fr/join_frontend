import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  animate: boolean = true; 
  form: 'Log in' | 'Sign up' = 'Log in';
  rememberLogIn: boolean = false;
  acceptPrivacyPolicy: boolean = false;

  toggleForm() {
    this.animate = false;
    this.form == 'Log in' ? this.form = 'Sign up' : this.form = 'Log in';
  }

  toggleRememberMe() {
    this.rememberLogIn = !this.rememberLogIn;
  }

  togglePrivacyPolicy() {
    this.acceptPrivacyPolicy = !this.acceptPrivacyPolicy;
  }
}
