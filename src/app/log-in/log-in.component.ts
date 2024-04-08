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
form: 'log in' | 'sign up' = 'log in';
rememberLogIn: boolean = false;

toggleRememberMe() {
  this.rememberLogIn = !this.rememberLogIn;
}
}
