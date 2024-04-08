import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  animate: boolean = true; 
  form: 'log in' | 'sign up' = 'log in';
  rememberLogIn: boolean = false;
  acceptPrivacyPolicy: boolean = false;

  toggleForm() {
    this.animate = false;
    this.form == 'log in' ? this.form = 'sign up' : this.form = 'log in';
  }

  toggleRememberMe() {
    this.rememberLogIn = !this.rememberLogIn;
  }

  togglePrivacyPolicy() {
    this.acceptPrivacyPolicy = !this.acceptPrivacyPolicy;
  }
}
